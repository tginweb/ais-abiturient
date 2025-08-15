
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduVolumeModel,
    EduVolumeResolvers,
    EduVolumeService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduVolumeModel
        ]),
    )

    module.exports.push(
        EduVolumeService
    )

    module.providers.push(
        EduVolumeService,
        EduVolumeResolvers
    )
}
