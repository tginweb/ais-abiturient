import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {AbitAppGroupModel} from "./model";

export class AbitAppGroupQuery extends MongooseQueryWrapper<AbitAppGroupModel> {
    populateRequired() {

    }

    withViewPublic() {
        this.populateRequired()
        return this
    }

    withViewAdmin() {
        this.populateRequired()

        return this
    }
}




