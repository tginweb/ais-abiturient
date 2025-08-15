
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduCompetitionModel,
    EduCompetitionResolvers,
    EduCompetitionService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduCompetitionModel
        ]),
    )

    module.exports.push(
        EduCompetitionService
    )

    module.providers.push(
        EduCompetitionService,
        EduCompetitionResolvers
    )
}

export function menuItems(items) {

}

export function hooks(hooks, module) {

    hooks.addFilter('entity_types', 'menu', (schema) => {

        schema.edu_admission = {

        }
    })
}
