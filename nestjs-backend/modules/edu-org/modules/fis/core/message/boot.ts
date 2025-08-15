import {TypegooseModule} from "nestjs-typegoose";

import {EduFisMessageController} from "~modules/edu-org/modules/fis/core/message/controller";

import {EduFisMessageModel, EduFisMessageResolvers, EduFisMessageService,} from './index';

import * as messageTypes from "./type";


export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            {
                typegooseClass: EduFisMessageModel,
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
        EduFisMessageService
    )
    module.providers.push(
        EduFisMessageService,
        EduFisMessageResolvers
    )
    module.controllers.push(
        EduFisMessageController
    )
}


export function menuItems(items, ctx) {

    items.push({
        parentCode: 'edu-fis',
        code: 'edu-fis.message',
        label: 'Cообщения',
        url: '/admin/edu-fis/message/list',
    })
}

