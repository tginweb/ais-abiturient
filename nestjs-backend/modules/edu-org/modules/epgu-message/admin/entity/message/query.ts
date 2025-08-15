import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message/model";

export class EduEpguMessageQuery extends MongooseQueryWrapper<EduEpguMessageModel> {

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


