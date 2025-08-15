
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduLevelModel,
    EduLevelResolvers,
    EduLevelService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduLevelModel
        ]),
    )

    module.exports.push(
        EduLevelService
    )

    module.providers.push(
        EduLevelService,
        EduLevelResolvers
    )
}
