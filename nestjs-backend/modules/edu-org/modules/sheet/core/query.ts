import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduSheetModel} from "./model";

export class EduSheetQuery extends MongooseQueryWrapper<EduSheetModel> {
    withDetails() {
        this.query.populate({
            path: 'orders',
            populate: [
            ]
        })
        return this
    }
}

