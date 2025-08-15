
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduRatingModel,
    EduRatingResolvers,
    EduRatingService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduRatingModel
        ]),
    )

    module.exports.push(
        EduRatingService
    )

    module.providers.push(
        EduRatingService,
        EduRatingResolvers
    )
}

export function menuItems(items) {

}

export function hooks(hooks, module) {


}
