import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduDocModel} from "~modules/edu-org/modules/doc/core/model";

export class EduDocQuery extends MongooseQueryWrapper<EduDocModel> {

    withRequired() {
        this.where({deleted: false})
        this.query.populate('filesDocs')
        this.query.populate('docCategory')
        this.query.populate('docType')
        return this
    }

    withViewAdmin(detail = false) {
        this.withRequired()
        return this
    }

    withViewPublic(detail = false) {
        this.withRequired()
        return this
    }

    filtersSchema() {
        return {

            epguFuiExists: (result, cond) => {
                if (cond.eq === true)
                    result.$and.push(
                        {'epgu.fui': {$exists: true}},
                    )
                else if (cond.eq === false)
                    result.$and.push(
                        {'epgu.fui': {$exists: false}},
                    )
            },

        }
    }
}

