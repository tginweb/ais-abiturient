import {AbitOrderQuery} from "~modules/edu-org/modules/abit/core/order/query";

export class AbitOrderPublicQuery extends AbitOrderQuery {

    withView() {

        this.query.populate('orderType')

        this.query.populate({
            path: 'applications.items.admission',
            populate: ['fob', 'direction']
        })

        this.query.populate({
            path: 'applications.items.specsAdmissions',
            populate: ['fob', 'direction']
        })

        this.query.populate('applications.items.source')

        this.query.populate('anket.entrance.subjects.subjectDoc')

        this.query.populate('anket.education.docFileModel')
        this.query.populate('anket.personal.docFileModel')

        this.query.populate('anket.entrance.achievements.docFileModel')
        this.query.populate('anket.entrance.achievements.achievementTypeDoc')

        this.query.populate('anket.benefits.quotes.docFileModel')

        this.query.populate('send.orderDocFileModel')
        this.query.populate('send.agreementDocFileModel')
        this.query.populate('send.agreementDenyDocFileModel')
        this.query.populate('send.photoFileModel')
        this.query.populate('send.consentDocFileModel')
        this.query.populate('send.consentDistDocFileModel')
        this.query.populate('send.compatriotBirthDocFileModel')
        this.query.populate('send.compatriotParentDocFileModel')
        this.query.populate('send.targetContractDocFileModel')

        return this
    }

}
