import {Args, Info, Mutation, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {Response} from "~lib/response";
import {EduOrderMessageAdminService as ModelAdminService} from "./service"
import {EduOrderMessageModel as Model} from "../core/model"
import {EduOrderMessageService as ModelCoreService} from "../core/service"
import {AbitOrderService} from "../../abit/core/order/service"

import * as mongoose from 'mongoose'
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../user/core/guards/userRolesAdminGuard";
import {UserRoles} from "~modules/user/core/decorators/user.roles.decorator";
import {EduOrderMessageService} from "../core/service";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduOrderMessage')
export class EduOrderMessageAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
        private readonly eduOrderMessageService: EduOrderMessageService,
        private readonly abitOrderService: AbitOrderService,
    ) {
    }

    @UserRoles('admin', 'manager', 'fac', 'operator')
    @Mutation('edu_order_message_admin_send')
    async send(
        @Args() args: any,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {

        let response = new Response();

        try {

            let order = await this.abitOrderService.query().where({_id: mongoose.Types.ObjectId(args.chatId)}).execOne()

            await this.coreService.sendCompanyMessage(args.chatId, user._id, order.userId, args.data)

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @UserRoles('admin', 'manager', 'fac', 'operator')
    @Mutation('edu_order_message_admin_read')
    async read(
        @Args() args: any,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {

        let response = new Response();

        try {
            let order = await this.abitOrderService.model.findOne({_id: args.chatId})

            let messages = await this.coreService.getMessagesByOrder(args.chatId)

            for (const msg of messages) {
                if (!msg.readedByCompany) {
                    msg.readedByCompany = true
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
