
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduSheetModel,
    EduSheetResolvers,
    EduSheetService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduSheetModel
        ]),
    )

    module.exports.push(
        EduSheetService
    )

    module.providers.push(
        EduSheetService,
        EduSheetResolvers
    )
}

export function menuItems(items) {

}

export function hooks(hooks, module) {


}
