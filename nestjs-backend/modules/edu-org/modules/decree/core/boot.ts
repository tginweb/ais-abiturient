
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduDecreeModel,
    EduDecreeResolvers,
    EduDecreeService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduDecreeModel
        ]),
    )

    module.exports.push(
        EduDecreeService
    )

    module.providers.push(
        EduDecreeService,
        EduDecreeResolvers
    )
}
