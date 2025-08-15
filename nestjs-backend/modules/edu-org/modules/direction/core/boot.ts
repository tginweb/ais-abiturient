
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduDirectionModel,
    EduDirectionResolvers,
    EduDirectionService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduDirectionModel
        ]),
    )

    module.exports.push(
        EduDirectionService
    )

    module.providers.push(
        EduDirectionService,
        EduDirectionResolvers
    )
}
