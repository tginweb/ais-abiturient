import {
    Body,
    Controller,
    Get,
    Response,
    NestInterceptor, NotFoundException,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UserRolesAdminGuard} from '../../user/core/guards/userRolesAdminGuard';
import {FileInterceptor} from '@nestjs/platform-express';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {FileModel} from "./model";
import * as fs from 'fs'
//const PDFDocument = require('pdfkit');
import {PageSizes, PDFDocument} from 'pdf-lib'
import {extname} from "path";
import * as mongoose from "mongoose";
import {diskStorage} from 'multer'
import {FileService} from "~modules/file/core/service";


const crypto = require('crypto');
const path = require('path')
const mime = require('mime')

@UseGuards(UserRolesAdminGuard)
@Controller('file')
export class FileController {
    constructor(
        @InjectModel(FileModel) private readonly fileModel: ReturnModelType<typeof FileModel> | any,
        private readonly service: FileService,
    ) {

    }

    @Get('downloadPdf')
    async downloadPdf(
        @Query('id') fileIdsArg: any,
        @Query('hash') hashArg: any,
        @Response() response
    ) {

        const fileIds = fileIdsArg.split('.').map(nid => parseInt(nid))

        const pdfFilename = fileIds.join('.') + '-' + hashArg + '.pdf'

        const pdfPath = path.join(process.cwd(), 'uploads/pdf/' + pdfFilename)

        let exists


        try {
            await fs.promises.access(pdfPath)
            exists = true
        } catch {
            exists = false
        }

        let files = await this.fileModel.find({nid: fileIds}).exec();

        const ids = files.map((item) => {
            return item && typeof item === 'object' ? item._id : null
        }).filter(val => !!val)

        const hashCheck = crypto.createHash('md5').update(ids.join('.')).digest("hex")

        if (hashCheck !== hashArg) {
            // response.send('ACCESS ERROR')
            // return
        }

        if (!exists) {

            console.log('NOT EXISTS')

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


    /*
    @Get('downloadPdf1')
    async downloadPdf1(@Query('id') fileIdsArg: any, @Response() response) {

        const fileIds = fileIdsArg.split('.')

        let files = await this.fileModel.find({nid: fileIds}).exec();

        const doc = new PDFDocument({size: 'A4'})

        const pdfPath = path.join(process.cwd(), 'uploads/output.pdf')

        doc.pipe(fs.createWriteStream(pdfPath))

        for (const file of files) {

            let filepath = path.join(process.cwd(), 'uploads/' + file.filename)

            doc.image(filepath, 0, 0, {
                fit: [590, 820],
                align1: 'center',
                valign1: 'center'
            })

            doc.addPage()

            console.log(filepath)

        }

        doc.end()

        await fs.promises.access(pdfPath);

        const data = fs.createReadStream(pdfPath);

        response.setHeader("Content-Type", mime.lookup(pdfPath));

        data.pipe(response);


    }

     */


    @Get('download')
    async download(
        @Query('id') fileId: any,
        @Response() response
    ) {

        let fileEntity = await this.fileModel.findOne({_id: fileId}).exec();

        if (!fileEntity) throw new NotFoundException();

        try {

            let filepath = path.join(process.cwd(), 'uploads/' + fileEntity.filename)

            await fs.promises.access(filepath);

            const data = fs.createReadStream(filepath);

            response.setHeader("Content-Type", mime.lookup(filepath));

            data.pipe(response);

        } catch (e) {

            throw new NotFoundException();
        }

    }

    @Post('upload')
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
    async upload(
        @UploadedFile() file,
        @Body() body: any,
    ): Promise<any> {

        let fileData = {
            temporary: body.temporary,
            relDocType: body.relDocType,
            relDocId: body.relDocId,
            relDocPath: body.relDocPath,
            mimetype: file.mimetype,
            originalname: file.originalname,
            filesize: file.size,
            filename: file.filename,
        }

        if (!this.service.createValidateErrors(fileData)) {

            /*
            this.fileService.delete({
                relDocType: fileData.relDocType,
                relDocId: fileData.relDocId,
                relDocPath: fileData.relDocPath
            })

             */

            const file = this.service.createModel(fileData)
            await file.savePromise()
            return file.getClientFields()
        }
    }

    @Post('delete')
    async delete(
        @Body() body: any,
    ): Promise<any> {
        const file = await this.service.query().getById(body.id)
        file.deleted = true
        await file.savePromise()
        return true
    }

}
