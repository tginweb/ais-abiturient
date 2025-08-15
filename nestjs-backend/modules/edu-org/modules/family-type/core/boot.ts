
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduFamilyTypeModel,
    EduFamilyTypeResolvers,
    EduFamilyTypeService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduFamilyTypeModel
        ]),
    )

    module.exports.push(
        EduFamilyTypeService
    )

    module.providers.push(
        EduFamilyTypeService,
        EduFamilyTypeResolvers
    )
}

