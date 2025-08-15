import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduProgramQuery} from "~modules/edu-org/modules/program/core/query";

export class EduProgramAdminQuery extends EduProgramQuery {

    withViewPublic() {

        //this.query.withView('public')
        this.query.populate('subjects.subject')
        this.query.populate('direction')
        this.query.populate('edulevel')
        return this
    }
}


