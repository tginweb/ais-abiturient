import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {AbitTestModel} from "./model";

export class AbitTestQuery extends MongooseQueryWrapper<AbitTestModel> {
    withRequired() {

        return this
    }
}




