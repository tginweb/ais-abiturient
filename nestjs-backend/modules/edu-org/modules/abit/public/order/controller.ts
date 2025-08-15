import {BadRequestException, Body, Controller, Post, Get, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common'
import {FileInterceptor} from '@nestjs/platform-express'
import {InjectModel} from "nestjs-typegoose"
import {ReturnModelType} from "@typegoose/typegoose"

import {AbitOrderModel as Model} from "../../core/order/model"
import {AbitOrderByUserGuard} from "./guard"
import {AbitOrderByUser} from './decorator'
import {FileService} from "~modules/file/core/service"
import * as mongoose from "mongoose";
import { diskStorage } from 'multer'
import { extname } from 'path'

@UseGuards(AbitOrderByUserGuard)
@Controller('order')
export class AbitOrderPublicController {
    constructor(
        @InjectModel(Model) private readonly orderModel: ReturnModelType<typeof Model> | any,
        private readonly fileService: FileService,
    ) {
    }


    @Post('file-delete')
    async fileDelete(
        @Body() data: any,
        @AbitOrderByUser() order: Model,
    ): Promise<any> {

        order.fileAction('delete', data.relDocPath, data.fileId)

        await order.savePromise()

        return {
            ddd: 'ok'
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
    }))
    async upload(
        @AbitOrderByUser() order: Model,
        @UploadedFile() file,
        @Body() body: any,
    ): Promise<any> {

        let fileId = new mongoose.Types.ObjectId()

        if (!order.fileAction('add', body.relDocPath, fileId)) {
            throw new BadRequestException('path not found');
        }

        let fileData = {
            _id: fileId,
            relDocType: 'order',
            relDocId: order._id,
            relDocPath: body.relDocPath,
            mimetype: file.mimetype,
            originalname: file.originalname,
            filesize: file.size,
            used: true,
            filename: file.filename
        }

        if (!this.fileService.createValidateErrors(fileData)) {

            /*
            this.fileService.delete({
                relDocType: fileData.relDocType,
                relDocId: fileData.relDocId,
                relDocPath: fileData.relDocPath
            })

             */

            let file = await this.fileService.createModel(fileData)

            await order.getDoc().save();

            return file
        }

        return fileData
    }

    @Post('upload-any')
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
    }))
    async uploadAny(
        @UploadedFile() file,
        @Body() body: any,
    ): Promise<any> {

        let fileId = new mongoose.Types.ObjectId()

        let order = await this.orderModel.findOne({_id: mongoose.Types.ObjectId(body.relDocId)})

        if (!order.setFile(body.relDocPath, fileId)) {
            throw new BadRequestException('path not found');
        }

        let fileData = {
            _id: fileId,
            relDocType: 'order',
            relDocId: order._id,
            relDocPath: body.relDocPath,
            mimetype: file.mimetype,
            originalname: file.originalname,
            filesize: file.size,
            used: true,
            filename: file.filename
        }

        if (!this.fileService.createValidateErrors(fileData)) {

            /*
            this.fileService.delete({
                relDocType: fileData.relDocType,
                relDocId: fileData.relDocId,
                relDocPath: fileData.relDocPath
            })

             */

            let file = await this.fileService.createModel(fileData)

            order.getDoc().save();

            return file
        }
    }


    @Post('upload-chat')
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
    }))
    async uploadChat(
        @UploadedFile() file,
        @Body() body: any,
    ): Promise<any> {

        let fileId = new mongoose.Types.ObjectId()

        let fileData = {
            _id: fileId,
            relDocType: 'order',
            relDocPath: 'chat',
            mimetype: file.mimetype,
            originalname: file.originalname,
            filesize: file.size,
            used: true,
            filename: file.filename
        }

        if (!this.fileService.createValidateErrors(fileData)) {

            /*
            this.fileService.delete({
                relDocType: fileData.relDocType,
                relDocId: fileData.relDocId,
                relDocPath: fileData.relDocPath
            })

             */

            await this.fileService.createModel(fileData)
        }

        return fileData
    }

}
