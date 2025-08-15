
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduProgramModel,
    EduProgramResolvers,
    EduProgramService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduProgramModel
        ]),
    )

    module.exports.push(
        EduProgramService
    )

    module.providers.push(
        EduProgramService,
        EduProgramResolvers
    )
}
