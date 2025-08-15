import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduCompetitionModel} from "./model";

export class EduCompetitionQuery extends MongooseQueryWrapper<EduCompetitionModel> {

    withViewPublic() {
        this.query.populate({
            path: 'admission',
            populate: ['fob', 'fac']
        })
        this.query.populate('source')
        return this
    }

    withDetails() {
        this.query.populate({
            path: 'appsRating',
            populate: [
                {
                    path: 'app',
                    populate: ['order']
                }
            ]
        })

        return this
    }

}

