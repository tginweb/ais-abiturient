
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduCountryModel,
    EduCountryResolvers,
    EduCountryService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduCountryModel
        ]),
    )

    module.exports.push(
        EduCountryService
    )

    module.providers.push(
        EduCountryService,
        EduCountryResolvers
    )
}

