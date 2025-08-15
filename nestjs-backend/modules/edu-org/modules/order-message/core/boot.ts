
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduOrderMessageModel,
    EduOrderMessageResolvers,
    EduOrderMessageService,
    EduOrderWithMessageResolvers
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduOrderMessageModel
        ]),
    )

    module.exports.push(
        EduOrderMessageService
    )

    module.providers.push(
        EduOrderMessageService,
        EduOrderMessageResolvers,
        EduOrderWithMessageResolvers
    )
}
