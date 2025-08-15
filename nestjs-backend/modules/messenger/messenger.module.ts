
import { APP_INTERCEPTOR } from "@nestjs/core/constants";
import { DataLoaderInterceptor } from "~lib/interceptors/dataloader";

import { Module } from '@nestjs/common';

import { TypegooseModule } from "nestjs-typegoose";

import { MessengerController } from './messenger.controller';

import {
    MessageModel,
    MessageService,
    MessageResolvers
} from './entity';


@Module({

    imports: [
        TypegooseModule.forFeature([
            MessageModel
        ]),
    ],
    exports: [
        MessageService,
    ],
    controllers: [
        MessengerController
    ],
    providers: [
        MessageService,
        MessageResolvers,
    ],
})
export class MessengerModule {
}
