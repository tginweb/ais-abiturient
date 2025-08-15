
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduSSAppModel,
    EduSSAppResolvers,
    EduSSAppService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduSSAppModel
        ]),
    )

    module.exports.push(
        EduSSAppService
    )

    module.providers.push(
        EduSSAppService,
        EduSSAppResolvers
    )
}
