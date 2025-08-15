import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduAchievementTypeModel} from "~modules/edu-org/modules/achievement/core/type/model";

export class EduAchievementTypeQuery extends MongooseQueryWrapper<EduAchievementTypeModel> {

    withRequired() {
        return this
    }
}
