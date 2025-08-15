
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduDoctypeModel,
    EduDoctypeResolvers,
    EduDoctypeService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduDoctypeModel
        ]),
    )

    module.exports.push(
        EduDoctypeService
    )

    module.providers.push(
        EduDoctypeService,
        EduDoctypeResolvers
    )
}

