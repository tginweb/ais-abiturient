
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduSubjectModel,
    EduSubjectResolvers,
    EduSubjectService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduSubjectModel
        ]),
    )

    module.exports.push(
        EduSubjectService
    )

    module.providers.push(
        EduSubjectService,
        EduSubjectResolvers
    )
}
