
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduInstituteModel,
    EduInstituteResolvers,
    EduInstituteService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduInstituteModel
        ]),
    )

    module.exports.push(
        EduInstituteService
    )

    module.providers.push(
        EduInstituteService,
        EduInstituteResolvers
    )
}
