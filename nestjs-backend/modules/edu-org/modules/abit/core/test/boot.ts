
import {TypegooseModule} from "nestjs-typegoose";

import {
    AbitTestModel,
    AbitTestResolvers,
    AbitTestService,
} from './index';

export function boot(module) {

    module.imports.push(
        TypegooseModule.forFeature([
            AbitTestModel,
        ]),
    )

    module.exports.push(
        AbitTestService
    )

    module.providers.push(
        AbitTestService,
        AbitTestResolvers,
    )
}
