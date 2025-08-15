import {Args, Info, Mutation, Resolver, } from '@nestjs/graphql';
import {BadRequestException, UseGuards} from "@nestjs/common";
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";

import {EduOrderMessageModel as Model} from "../core/model"
import {EduOrderMessageService} from "../core/service"
import {EduOrderMessageService as ModelCoreService} from "../core/service"


import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {Response} from "~lib/response";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order/service";
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {AbitOrderByUser} from "~modules/edu-org/modules/abit/public/order/decorator";
import {AbitOrderByUserGuard} from "~modules/edu-org/modules/abit/public/order/guard";

@UseGuards(AbitOrderByUserGuard)
@Resolver('EduOrderMessage')
export class EduOrderMessagePublicResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        @Inject(forwardRef(() => EduOrderMessageService))
        private readonly abitOrderService: AbitOrderService,
    ) {
    }

    @Mutation('edu_order_message_public_send')
    async send(
        @Args() args: any,
        @Info() info,
        @UserCurrent() user: UserModel,
        @AbitOrderByUser() order: AbitOrderModel,
    ) {

        let response = new Response();

        await this.coreService.sendClientMessage(order._id, user._id, order.userId, args.data)

        return response.getJson()
    }

    @Mutation('edu_order_message_public_read')
    async read(
        @Args() args: any,
        @Info() info,
        @UserCurrent() user: UserModel,
        @AbitOrderByUser() order: AbitOrderModel,
    ) {

        let response = new Response();

        try {

            let messages = await this.coreService.getMessagesByOrder(order._id)


            for (const msg of messages) {
                if (!msg.readedByClient) {

                    msg.readedByClient = true
                    await msg.save()
                }
            }

            order.updateChatStat(messages)

            await order.savePromise()
        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }
}
