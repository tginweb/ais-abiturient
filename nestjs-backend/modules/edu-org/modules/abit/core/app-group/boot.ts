
import {TypegooseModule} from "nestjs-typegoose";

import {
    AbitAppGroupModel,
    AbitAppGroupResolvers,
    AbitAppGroupService,
} from './index';

export function boot(module) {

    module.imports.push(
        TypegooseModule.forFeature([
            AbitAppGroupModel,
        ]),
    )

    module.exports.push(
        AbitAppGroupService
    )

    module.providers.push(
        AbitAppGroupService,
        AbitAppGroupResolvers,
    )
}
