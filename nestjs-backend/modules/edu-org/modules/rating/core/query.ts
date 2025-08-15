import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduRatingModel} from "./model";

export class EduRatingQuery extends MongooseQueryWrapper<EduRatingModel> {
    withDetails() {
        return this
    }
}

