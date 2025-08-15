import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduOrderMessageModel as Model} from "./model";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduOrderMessageQuery as ModelQuery} from "./query";
import {EventEmitter2} from "@nestjs/event-emitter";


@Injectable()
export class EduOrderMessageService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private readonly aisService: EduAisService,
        private readonly eventEmitter: EventEmitter2,
    ) {
    }

    find<T>(filter: any = null, nav: any = null, view = 'default'): any {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withView(view)
            .exec()
    }

    async findOneBy<T>(by: string, val: any, view = 'default'): Promise<any> {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter({[by]: val})
            .withView(view)
            .findOne()
            .exec()
    }

    createModel<T>(data: any): Model {
        return new this.model(data)
    }

    getNewMessageModel(orderId, senderType, senderUserId, recipientUserId, message, context) {

        let orderMessage = new this.model({})

        orderMessage.orderId = orderId
        orderMessage.senderType = senderType
        orderMessage.senderUserId = senderUserId
        orderMessage.recipientUserId = recipientUserId
        orderMessage.message = message

        return orderMessage
    }

    async sendSystemMessage(orderId, senderUserId, recipientUserId, message, context={}): Promise<any> {
        let orderMessage = this.getNewMessageModel(
            orderId,
            'system',
            senderUserId,
            recipientUserId,
            message,
            context
        )
        await orderMessage.save();

        this.eventEmitter.emit('message-publish', orderMessage);
    }

    async sendCompanyMessage(orderId, senderUserId, recipientUserId, message, context={}): Promise<any> {
        let orderMessage = this.getNewMessageModel(
            orderId,
            'company',
            senderUserId,
            recipientUserId,
            message,
            context
        )
        await orderMessage.save();

        this.eventEmitter.emit('message-publish', orderMessage);
    }

    async sendClientMessage(orderId, senderUserId, recipientUserId, message, context={}): Promise<any> {
        let orderMessage = this.getNewMessageModel(
            orderId,
            'client',
            senderUserId,
            recipientUserId,
            message,
            context
        )
        await orderMessage.save();

        this.eventEmitter.emit('message-publish', orderMessage);
    }

    async getMessagesByOrder(orderId): Promise<any> {
        return this.model.find({orderId: orderId}).populate('senderUserId', 'firstName lastName roles');
    }
}
