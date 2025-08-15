import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduSSAppModel} from "~modules/edu-org/modules/ss-app/core/model";

export class EduSSAppQuery extends MongooseQueryWrapper<EduSSAppModel> {

    withViewPublic() {
        this.query.populate('apps.competition')
        return this
    }

}

