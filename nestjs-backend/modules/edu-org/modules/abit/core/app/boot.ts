
import {TypegooseModule} from "nestjs-typegoose";

import {
    AbitAppModel,
    AbitAppResolvers,
    AbitAppService,
} from './index';

export function boot(module) {

    module.imports.push(
        TypegooseModule.forFeature([
            AbitAppModel,
        ]),
    )

    module.exports.push(
        AbitAppService
    )

    module.providers.push(
        AbitAppService,
        AbitAppResolvers,
    )
}
