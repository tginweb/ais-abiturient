import {Body, Controller, Get, Post, Query, Response, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {UserRolesAdminGuard} from '../../../../user/core/guards/userRolesAdminGuard';
import * as fs from 'fs'
//const PDFDocument = require('pdfkit');
import {PageSizes, PDFDocument} from 'pdf-lib'
import {FileService} from "~modules/file/core/service";
import {EduDocService} from './service'
import {FileInterceptor} from "@nestjs/platform-express";
import {extname} from "path";
import {diskStorage} from 'multer'

const crypto = require('crypto');
const path = require('path')
const mime = require('mime')

@UseGuards(UserRolesAdminGuard)
@Controller('doc')
export class DocController {
    constructor(
        private readonly fileService: FileService,
        private readonly service: EduDocService
    ) {

    }

    @Get('downloadPdf')
    async downloadPdf(
        @Query('sid') docSid: any,
        @Response() response
    ) {

        const doc = await this.service.query().where({sid: docSid}).execOne()

        const pdfFilename = doc.id + '.pdf'

        const pdfPath = path.join(process.cwd(), 'uploads/pdf/' + pdfFilename)

        let exists

        try {
            await fs.promises.access(pdfPath)
            exists = true
        } catch {
            exists = false
        }

        let files = await this.fileService.query().filterIds({id: doc.files}).execMany();

        exists = false

        if (!exists) {

            const pdfDoc = await PDFDocument.create()

            for (const file of files) {

                const filepath = path.join(process.cwd(), 'uploads/' + file.filename)

                const fileExt = path.extname(file.filename).toUpperCase()

                const fileStream = fs.readFileSync(filepath)

                if (fileExt === '.JPEG' || fileExt === '.JPG' || fileExt === '.PNG') {

                    const page = pdfDoc.addPage(PageSizes.A4)

                    let pngImage

                    if (fileExt === '.JPEG' || fileExt === '.JPG') {
                        pngImage = await pdfDoc.embedJpg(fileStream)
                    } else if (fileExt === '.PNG') {
                        pngImage = await pdfDoc.embedPng(fileStream)
                    }

                    const dims = pngImage.scaleToFit(590, 820)

                    page.drawImage(pngImage, {
                        x: 0,
                        y: PageSizes.A4[1] - dims.height,
                        width: dims.width,
                        height: dims.height,
                    })


                } else if (fileExt === '.PDF') {

                    const sourcePdfDoc = await PDFDocument.load(fileStream)

                    const pages = await pdfDoc.embedPages(sourcePdfDoc.getPages())

                    pages.forEach((spage) => {
                        const page = pdfDoc.addPage(PageSizes.A4)

                        page.drawPage(spage, {
                            x: 0,
                            y: 0,
                            width: 590,
                            height: 820
                        });
                    })
                }

            }

            const pdfBytes = await pdfDoc.save()

            await fs.promises.writeFile(pdfPath, pdfBytes)
        }

        const data = fs.createReadStream(pdfPath);

        response.setHeader("Content-Type", mime.lookup(pdfPath));

        data.pipe(response);

    }


    @Post('upload-file')
    @UseInterceptors(FileInterceptor('file', {
        limits: {
            fieldSize: 100000000
        },
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                cb(null, `${randomName}${extname(file.originalname)}`)
            }
        }),
    }) as any)
    async uploadFile(
        @UploadedFile() file,
        @Body() body: any,
    ): Promise<any> {

        const docId = body.docId

        let fileData = {
            temporary: !!body.temporary,
            relDocType: 'doc',
            relDocId: docId,
            mimetype: file.mimetype,
            originalname: file.originalname,
            filesize: file.size,
            filename: file.filename,
        }

        if (true) {

            const file = this.fileService.createModel(fileData)
            await file.savePromise()

            if (!body.temporary) {

                const doc = await this.service.query().getById(docId)
                if (doc) {
                    if (!doc.files)
                        doc.files = []
                    doc.files.push(file.id)
                    await doc.savePromise()
                }
            }

            return file.getClientFields()
        }
    }

    @Post('file-delete')
    async delete(
        @Body() body: any,
    ): Promise<any> {
        const docId = body.docId

        const file = await this.fileService.query().getById(body.id)

        if (file) {
            file.deleted = true
            await file.savePromise()
        }

        const doc = await this.service.query().getById(docId)

        if (doc) {
            doc.files = doc.files.filter(fileId => fileId !== body.fileId)
            await doc.savePromise()
        }

        return true
    }
}
