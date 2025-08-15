import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app/model";

export class AbitAppQuery extends MongooseQueryWrapper<AbitAppModel> {
    populateRequired() {
        this.query.populate('admission')
        this.query.populate('source')
    }

    withViewPublic() {
        this.populateRequired()
        return this
    }

    withViewAdmin() {
        this.populateRequired()
        this.query.populate('order')
        return this
    }
}




