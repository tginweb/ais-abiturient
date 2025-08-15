
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduAdmissionModel,
    EduAdmissionResolvers,
    EduAdmissionService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduAdmissionModel
        ]),
    )

    module.exports.push(
        EduAdmissionService
    )

    module.providers.push(
        EduAdmissionService,
        EduAdmissionResolvers
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
