import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduAchievementTypeModel as Model} from "./model"
import {EduAchievementService} from "./service";
import {AchievementStatusList} from "~modules/edu-org/modules/achievement/core/enum";
import {EduAchievementTypeQuery as ModelQuery} from "./query";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";

@Resolver('EduAchievement')
export class EduAchievementResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly modelService: EduAchievementService,
    ) {
    }

    @Query('edu_achievement_statuses')
    async statuses(@Args() args, @Info() info) {
        return AchievementStatusList
    }

    @Query('edu_achievement_types')
    async types(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }
}
