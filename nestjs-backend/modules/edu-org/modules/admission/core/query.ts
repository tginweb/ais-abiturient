import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";

export class EduAdmissionQuery extends MongooseQueryWrapper<EduAdmissionModel> {

    withViewPublic() {

        //this.query.withView('public')
        this.query.populate('subjects.subject')
        this.query.populate('direction')
        this.query.populate('level')
        this.query.populate('campaign')
        this.query.populate('fob')
        this.query.populate('fac')

        this.query.populate('competitions.tests.subject')

        //this.query.populate('competitions.source')

        this.query.populate({
            path: 'competitionsList',
            populate: ['source']
        })

        return this
    }

    filtersSchema() {
        return {
            haveDopnabor: async (result, cond) => {
                if (cond.eq) {
                    result.$and.push({
                        abbr: {$in: [
                            'АТПРб',
                            'ИТб',
                            'ИФб',
                            'ИГ',
                            'РГ',
                            'ЭЭб',
                            'СОб',
                            'РДб',
                            'СТЭб',
                            'МТб',
                            'ММб',
                            'МИРб',
                            'ХТТб',
                            'ТПб',
                            'ТПбз',
                            'ТБб',
                            'КНб',
                            'МЦб',
                            'ЛИМб',
                            'АСб',
                            'ААбз',
                            'ЭЛб',
                            'УКб',
                            'ИМбз',
                            'НМб',
                            'ГИС',
                            'ГД',
                            'ТСЧС',
                            'СДМз'
                            ]}
                    })
                }
            },
            epgu: async (result, cond) => {
                if (cond)
                    result.$and.push({
                        $and: [
                            {clevel: {$in: [1, 2]}},
                            {cfob: {$in: [1]}},
                            {budgCount: {$gt: 0}},
                        ]
                    })
            },
            volOnlyCommerce: async (result, cond) => {
                if (cond)
                    result.$and.push({
                        $or: [
                            {budgCount: {$eq: 0}},
                            {comercCount: {$gt: 0}},
                        ]
                    })
            },

            haveVolume: async (result, cond) => {
                if (cond)
                    result.$and.push({
                        $or: [
                            {budgCount: {$gt: 0}},
                            {comercCount: {$gt: 0}},
                        ]
                    })
                else
                    result.$and.push({
                        $and: [
                            {budgCount: {$eq: 0}},
                            {comercCount: {$eq: 0}},
                        ]
                    })
            },
            haveBudgetVolume: async (result, cond) => {
                if (cond)
                    result.$and.push({
                        $or: [
                            {budgCount: {$gt: 0}},
                        ]
                    })
            },
            directionOkso: async (result, cond) => {

                const directionIds = (await this.context.serviceEduDirection.find({
                    cod: {
                        $regex: RegExp('\.*' + cond + '\.*', "i")
                    }
                })).map(item => item.id)

                if (directionIds.length)
                result.$and.push({
                    'cdirection': {$in: directionIds}
                })

            },
        }
    }

}

