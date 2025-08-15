import {TypegooseModule} from "nestjs-typegoose";

import {EduAchievementTypeModel} from './type/model';
import {EduAchievementResolvers} from './type/resolvers';
import {EduAchievementService} from './type/service';

import {EduAchievementItemModel} from './item/model';
import {EduAchievementItemResolvers} from './item/resolvers';
import {EduAchievementItemService,} from './item/service';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduAchievementTypeModel,
            EduAchievementItemModel
        ]),
    )

    module.exports.push(
        EduAchievementService,
        EduAchievementItemService
    )

    module.providers.push(
        EduAchievementService,
        EduAchievementResolvers,

        EduAchievementItemService,
        EduAchievementItemResolvers
    )
}
