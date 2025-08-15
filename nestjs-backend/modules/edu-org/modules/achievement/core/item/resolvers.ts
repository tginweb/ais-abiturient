import {Info, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduAchievementItemModel, EduAchievementItemModel as Model} from "./model"
import {EduAchievementItemService} from "./service";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";

@Resolver('EduAchievementItem')
export class EduAchievementItemResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly modelService: EduAchievementItemService,
    ) {
    }

    @ResolveField()
    async type(
        @Parent() parent: EduAchievementItemModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return await parent.getTypeDoc()
    }

    @ResolveField()
    async doc(
        @Parent() parent: EduAchievementItemModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        const doc = await parent.getDocDoc()
        return doc
    }
}
