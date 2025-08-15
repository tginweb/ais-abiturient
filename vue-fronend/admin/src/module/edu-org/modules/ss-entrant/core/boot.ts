
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduSSEntrantModel,
    EduSSEntrantResolvers,
    EduSSEntrantService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduSSEntrantModel
        ]),
    )

    module.exports.push(
        EduSSEntrantService
    )

    module.providers.push(
        EduSSEntrantService,
        EduSSEntrantResolvers
    )
}
