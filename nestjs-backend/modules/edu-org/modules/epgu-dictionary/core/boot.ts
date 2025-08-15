import {TypegooseModule} from "nestjs-typegoose";

import {EduEpguDictionaryModel, EduEpguDictionaryResolvers, EduEpguDictionaryService} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            {
                typegooseClass: EduEpguDictionaryModel,
            },
        ]),
    )

    module.exports.push(
        EduEpguDictionaryService
    )

    module.providers.push(
        EduEpguDictionaryService,
        EduEpguDictionaryResolvers
    )
}

export function menuItems(items, ctx) {

}
