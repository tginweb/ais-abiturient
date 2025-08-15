
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduSourceModel,
    EduSourceResolvers,
    EduSourceService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduSourceModel
        ]),
    )

    module.exports.push(
        EduSourceService
    )

    module.providers.push(
        EduSourceService,
        EduSourceResolvers
    )
}
