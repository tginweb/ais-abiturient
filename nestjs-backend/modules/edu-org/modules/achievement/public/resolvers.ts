import {Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduAchievementTypeModel as Model} from "../core/type/model"
import {EduAchievementService as ModelCoreService} from "../core/type/service"

@Resolver('EduAchievement')
export class EduAchievementPublicResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
    ) {
    }


}
