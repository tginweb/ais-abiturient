import {BadRequestException, HttpException, NotFoundException} from '@nestjs/common';
import {Args, Info, Query, Mutation, Resolver, ResolveField, Subscription, Parent, Root, CONTEXT, Context} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {GqlCurrentUser} from "~modules/auth/auth.decorator";
import {Response} from "~lib/response";
import {UpdateOrderAddressAndContactsDto} from "./model/dto/update-order-address-and-contacts";
import { mongo } from 'mongoose';
import {ValidationException} from "~lib/validator/validation.exception";

import {MessageModel, MessageService} from "./index"

const graphqlFields = require('graphql-fields');

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


@Resolver('MessengerMessage')
export class MessageResolvers {

    constructor(
        @InjectModel(MessageModel) private readonly messageModel: ReturnModelType<typeof MessageModel> | any,
        private readonly messageService: MessageService,
    ) {
    }

    @Query('messengerGetUserMessages')
    async messengerGetUserMessages(
        @Args() args,
        @Info() info,
        @GqlCurrentUser() user: any,
    ) {

        let items = await this.messageModel.find().exec();

        return [
            {
                message: 'dddd'
            },
            {
                message: 'dddd'
            },
            {
                message: 'dddd'
            },
            {
                message: 'dddd'
            },

        ]
    }



}
