import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduAisEntrantModel} from "~modules/edu-org/modules/ais-entrant/model";

export class EduAisEntrantQuery extends MongooseQueryWrapper<EduAisEntrantModel> {

    filtersSchema() {
        return {
            orderExists: async (result, cond) => {
                if (cond.eq === true) {
                    result.$and.push({
                        orderNid: {$ne: []}
                    })
                } else if (cond.eq === false) {
                    result.$and.push({
                        orderNid: {$eq: []}
                    })
                }
            },
            haveDecree: async (result, cond) => {
                if (cond.eq === true) {
                    result.$and.push({
                        citem: {$gt: 0}
                    })
                } else if (cond.eq === false) {
                    result.$and.push({
                        citem: 0
                    })
                }
            },
        }
    }

    withViewPublic() {

        this.query.populate('subjects.subject')
        this.query.populate({
            path: 'apps.admission',
            populate: ['fob', 'fac', 'direction']
        })

        this.query.populate('apps.source')
        this.query.populate('apps.competition')


        //this.query.populate('admission')
        //this.query.populate('source')

        return this
    }

}

