
import {TypegooseModule} from "nestjs-typegoose";

import {EduAisEntrantModel} from './model'
import {EduAisEntrantResolvers} from './resolvers'
import {EduAisEntrantService} from './service'
import {EduAisEntrantController} from './controller'

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduAisEntrantModel
        ]),
    )
    module.controllers.push(
        EduAisEntrantController
    )
    module.exports.push(
        EduAisEntrantService
    )

    module.providers.push(
        EduAisEntrantService,
        EduAisEntrantResolvers,
    )
}


export function menuItems(items) {

    items.push({
        parentCode: 'edu-ais',
        label: 'АИС абитуриенты',
        url: '/admin/ais/entrant/list',
        accessGroups: ['manager'],
    })
}
