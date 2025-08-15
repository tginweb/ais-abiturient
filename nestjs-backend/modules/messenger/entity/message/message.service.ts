import {Injectable, Scope, Inject} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {MessageModel} from "./index";


@Injectable()
export class MessageService {

    constructor(
        @InjectModel(MessageModel) public readonly messageModel: ReturnModelType<typeof MessageModel>,
    ) {
    }

    async findOneByUser<T>(userId: number): Promise<any> {
        return await this.messageModel.findOne();
    }

    async findByUser<T>(userId: number): Promise<any> {
        return await this.messageModel.find();
    }
}