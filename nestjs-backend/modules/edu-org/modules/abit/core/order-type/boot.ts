
import {TypegooseModule} from "nestjs-typegoose";

import {
    AbitOrderTypeModel,
    AbitOrderTypeService,
    AbitOrderTypeResolvers,
} from './';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            AbitOrderTypeModel
        ]),
    )

    module.exports.push(
        AbitOrderTypeService
    )

    module.providers.push(
        AbitOrderTypeService,
        AbitOrderTypeResolvers
    )
}
