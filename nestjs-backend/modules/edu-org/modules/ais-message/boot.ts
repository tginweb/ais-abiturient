import {TypegooseModule} from "nestjs-typegoose";

import {EduAisMessageController} from "./controller";

import {EduAisMessageModel, EduAisMessageResolvers, EduAisMessageService} from './index';

import * as messageTypes from "./type";
export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            {
                typegooseClass: EduAisMessageModel,
                discriminators: Object.keys(messageTypes).map((key) => {
                    return {
                        typegooseClass: messageTypes[key],
                        discriminatorId: key
                    }
                })
            },
        ]),
    )
    module.exports.push(
        EduAisMessageService
    )
    module.providers.push(
        EduAisMessageService,
        EduAisMessageResolvers
    )
    module.controllers.push(
        EduAisMessageController
    )
}


export function menuItems(items, ctx) {

    items.push({
        parentCode: 'edu-ais',
        code: 'edu-ais.message',
        label: 'Задания',
        url: '/admin/ais/message/list',
    })
}

