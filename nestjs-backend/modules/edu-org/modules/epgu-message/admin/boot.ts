import {TypegooseModule} from "nestjs-typegoose";

import {EduEpguMessageController} from "~modules/edu-org/modules/epgu-message/admin/entity/message/controller";

import {EduEpguMessageModel, EduEpguMessageResolvers, EduEpguMessageService,} from './entity/message';

import * as messageTypes from "./entity/message/type";


export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            {
                typegooseClass: EduEpguMessageModel,
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
        EduEpguMessageService
    )
    module.providers.push(
        EduEpguMessageService,
        EduEpguMessageResolvers
    )
    module.controllers.push(
        EduEpguMessageController
    )
}


export function menuItems(items, ctx) {

    items.push({
        parentCode: 'edu-epgu',
        code: 'edu-epgu-queue.message',
        label: 'Cообщения',
    })

    items.push({
        parentCode: 'edu-epgu-queue.message',
        code: 'edu-epgu-queue.message.active.service',
        label: 'Очередь Сервиса',
        url: '/admin/edu-epgu/messages/active/service',
    })

    items.push({
        parentCode: 'edu-epgu-queue.message',
        code: 'edu-epgu-queue.message.active.epgu',
        label: 'Очередь ЕПГУ',
        url: '/admin/edu-epgu/messages/active/epgu',
    })

    items.push({
        parentCode: 'edu-epgu-queue.message',
        code: 'edu-epgu-queue.message.archive',
        label: 'Архив',
        url: '/admin/edu-epgu/messages/archive',
    })

    items.push({
        parentCode: 'edu-epgu',
        code: 'edu-epgu-events',
        label: 'События',
        url: '/admin/edu-epgu/event/list',
    })

}

