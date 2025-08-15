
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduFobModel,
    EduFobResolvers,
    EduFobService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduFobModel
        ]),
    )

    module.exports.push(
        EduFobService
    )

    module.providers.push(
        EduFobService,
        EduFobResolvers
    )
}
