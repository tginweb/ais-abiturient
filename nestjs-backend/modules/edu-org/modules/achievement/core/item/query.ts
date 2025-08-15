import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduAchievementItemModel} from "~modules/edu-org/modules/achievement/core/item/model";

export class EduAchievementItemQuery extends MongooseQueryWrapper<EduAchievementItemModel> {
    withRequired() {
        return this
    }
}
