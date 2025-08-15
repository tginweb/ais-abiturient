import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduSSEntrantModel} from "~modules/edu-org/modules/ss-entrant/core/model";

export class EduSSEntrantQuery extends MongooseQueryWrapper<EduSSEntrantModel> {

    withViewPublic() {


        return this
    }

}


