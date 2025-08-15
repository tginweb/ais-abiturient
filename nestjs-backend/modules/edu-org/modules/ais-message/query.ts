import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduAisMessageModel} from "~modules/edu-org/modules/ais-message/model";

export class EduAisMessageQuery extends MongooseQueryWrapper<EduAisMessageModel> {

    populate() {
        this.query.populate('order')
        return this
    }

    withViewAdmin() {
        this.query.populate('entrantOrder')
        this.query.populate({
            path: 'entrantApp',
            populate: ['order']
        })
        return this
    }

}


