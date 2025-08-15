import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {AbitOrderModel} from "./model"
import {AbitOrderStatusEnum} from "~modules/edu-org/modules/abit/core/order/statics/status";

export class AbitOrderQuery extends MongooseQueryWrapper<AbitOrderModel> {

    get nidField() {
        return 'nid'
    }

    withViewAdmin(detail = false) {
        this.withRequired()
        this.withApps()
        this.withAdmin()
        if (detail)
            this.withFiles()
        return this
    }

    withViewPublic(detail = false) {
        this.withRequired()
        this.withApps()
        if (detail)
            this.withFiles()
        return this
    }

    withAdmin() {
        this.query.populate('user')
        this.query.populate('operator')
        return this
    }

    withRequired() {

        this.query.populate({
            path: 'tests',
            populate: ['subject']
        })

        this.query.populate({
            path: 'decree',
        })

        this.query.populate({
            path: 'prezachCompetition',
            populate: [
                {
                    path: 'admission',
                    populate: [
                        {
                            path: 'fac',
                        },
                    ]
                },
            ]
        })

        this.query.populate({
            path: 'firstApp.competition',
            populate: [
                {
                    path: 'admission',
                },
            ]
        })

        this.query.populate({
            path: 'firstApp.fac',
        })

        this.query.populate({
            path: 'appGroups',
            populate: [
                {
                    path: 'apps',
                    populate: [
                        {
                            path: 'competition',
                            populate: [
                                {
                                    path: 'admission',
                                    populate: [
                                        'fob'
                                    ]
                                },
                                {
                                    path: 'source'
                                },
                                {
                                    path: 'fob'
                                },
                            ]
                        }
                    ]
                }
            ]
        })

        this.query.populate('orderType')
        this.query.populate('anket.entrance.subjects.subjectDoc')
        this.query.populate('anket.entrance.achievements.achievementTypeDoc')
        this.query.populate('institute')

        this.query.populate('applications.items.source')
        this.query.populate({
            path: 'applications.items.admission',
            populate: ['fob', 'direction']
        })

        this.query.populate({
            path: 'applications.items.specsAdmissions',
            populate: ['fob', 'direction']
        })
        return this
    }

    withApps() {

        this.query.populate({
            path: 'apps',
            populate: ['admission', 'source', 'fob']
        })

        this.query.populate({
            path: 'apps.specsAdmissions',
            populate: ['direction']
        })

        return this
    }

    withFiles() {
        this.query.populate('files')

        this.query.populate('anket.benefits.quotes.docFileModel')
        this.query.populate('anket.education.docFileModel')
        this.query.populate('anket.personal.docFileModel')
        this.query.populate('send.orderDocFileModel')
        this.query.populate('send.agreementDocFileModel')
        this.query.populate('send.agreementDenyDocFileModel')
        this.query.populate('send.photoFileModel')
        this.query.populate('send.consentDocFileModel')
        this.query.populate('send.consentDistDocFileModel')

        this.query.populate('send.compatriotBirthDocFileModel')
        this.query.populate('send.compatriotParentDocFileModel')
        this.query.populate('send.targetContractDocFileModel')
        this.query.populate('anket.entrance.achievements.docFileModel')

        return this
    }

    filterActual() {
        this.where({
            'state.status': {$nin: [AbitOrderStatusEnum.DUPLICATE]}
        })
        return this
    }
}




