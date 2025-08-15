
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduPersonDoctypeModel,
    EduPersonDoctypeResolvers,
    EduPersonDoctypeService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduPersonDoctypeModel
        ]),
    )

    module.exports.push(
        EduPersonDoctypeService
    )

    module.providers.push(
        EduPersonDoctypeService,
        EduPersonDoctypeResolvers
    )
}

