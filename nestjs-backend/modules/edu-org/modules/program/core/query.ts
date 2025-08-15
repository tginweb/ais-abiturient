import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduProgramModel} from "~modules/edu-org/modules/program/core/model";

export class EduProgramQuery extends MongooseQueryWrapper<EduProgramModel> {

    withViewPublic() {

        this.query.populate('direction')
        this.query.populate('fob')
        this.query.populate('admission')

        return this
    }

}
