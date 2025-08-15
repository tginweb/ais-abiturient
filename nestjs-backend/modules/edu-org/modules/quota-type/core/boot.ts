
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduQuotaTypeModel,
    EduQuotaTypeResolvers,
    EduQuotaTypeService,

} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduQuotaTypeModel
        ]),
    )

    module.exports.push(
        EduQuotaTypeService
    )

    module.providers.push(
        EduQuotaTypeService,
        EduQuotaTypeResolvers
    )
}

