import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduFisMessageModel} from "~modules/edu-org/modules/fis/core/message/model";

export class EduFisMessageQuery extends MongooseQueryWrapper<EduFisMessageModel> {

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


