import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduDecreeModel} from "~modules/edu-org/modules/decree/core/model";

export class EduDecreeQuery extends MongooseQueryWrapper<EduDecreeModel> {

    withRequired() {

        this.query.populate({
            path: 'campaign',
        })

        return this
    }

}

