import {TypegooseModule} from "nestjs-typegoose";

import {EduDocModel, EduDocResolvers, EduDocService, DocController} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduDocModel
        ]),
    )
    module.controllers.push(
        DocController
    )
    module.exports.push(
        EduDocService
    )

    module.providers.push(
        EduDocService,
        EduDocResolvers
    )
}
