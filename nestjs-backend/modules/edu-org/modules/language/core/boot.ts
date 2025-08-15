
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduLanguageModel,
    EduLanguageResolvers,
    EduLanguageService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduLanguageModel
        ]),
    )

    module.exports.push(
        EduLanguageService
    )

    module.providers.push(
        EduLanguageService,
        EduLanguageResolvers
    )
}

