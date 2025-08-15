
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduEgeModel,
    EduEgeResolvers,
    EduEgeService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduEgeModel
        ]),
    )

    module.exports.push(
        EduEgeService
    )

    module.providers.push(
        EduEgeService,
        EduEgeResolvers
    )
}
