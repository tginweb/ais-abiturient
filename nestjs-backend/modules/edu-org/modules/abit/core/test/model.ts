import {modelOptions, plugin, pre, prop} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from "~lib/db/typegoose/base.model";
import {AbitWorkplaceEnum, AbitWorkplaceMap} from "~modules/edu-org/enum/source-workplace";
import {AbitTestModelContext} from "./model-context"
import {ObjectID} from "mongodb";
import {EduSubjectModel} from "~modules/edu-org/modules/subject/core/model";
import {abitTestPassingTypeById, AbitTestPassingTypeEnum} from "~modules/edu-org/modules/abit/core/test/enum";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";

const dayjs = require('dayjs')

const autoincrement = require('simple-mongoose-autoincrement');

@plugin(paginationPlugin, {
    defaultSortField: 'createAt',
    defaultSortAscending: false,
    views: {
        default: ['_id', 'id', 'created', 'title', 'csubject', 'type', 'taxonomy', 'secret'],
        public: ['_id', 'id', 'created', 'title', 'csubject', 'type', 'taxonomy'],
    }
})
@plugin(require('mongoose-named-scopes'))
@plugin(autoincrement, {field: 'nid'})
@modelOptions({
    schemaOptions: {
        collection: "edu_test",
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    },
})
@pre<AbitTestModel>('save', async function () {


})
export class AbitTestModel extends BaseModel {

    _id: ObjectID

    @prop({cfilter: true})
    nid: number

    @prop({cfilter: true})
    orderId: string

    @prop({cfilter: true})
    orderNid: number

    @prop({cfilter: true})
    locked: boolean

    @prop({cfilter: true})
    fio: string

    @prop({cfilter: true})
    snils: string

    @prop({cfilter: true})
    csubject: number

    @prop({cfilter: true})
    isEge: boolean


    @prop({cfilter: true})
    abitPassingType: AbitTestPassingTypeEnum

    @prop({cfilter: true})
    abitEgeBall: number

    @prop({cfilter: true})
    abitEgeReady: boolean

    @prop({cfilter: true})
    abitEgeYear: number


    @prop({cfilter: true})
    passingType: AbitTestPassingTypeEnum


    @prop({cfilter: true})
    resultBall: number

    @prop({cfilter: true})
    resultType: string

    @prop({cfilter: true})
    resultDate: Date

    @prop({cfilter: true})
    resultVerified: boolean


    @prop({cfilter: true})
    createSource: AbitWorkplaceEnum

    @prop({ref: () => EduSubjectModel, localField: "csubject", foreignField: "id", justOne: true})
    subject?: EduSubjectModel

    @prop({ref: () => AbitOrderModel, localField: "orderId", foreignField: "_id", justOne: true})
    order?: AbitOrderModel

    createAt: Date
    updateAt: Date

    context: AbitTestModelContext = {}
    subjectFetched: boolean

    get id() {
        return this._id.toString()
    }

    get abitPassingTypeName() {
        return abitTestPassingTypeById[this.abitPassingType] && abitTestPassingTypeById[this.abitPassingType].name
    }

    get passingTypeName() {
        return abitTestPassingTypeById[this.passingType] ? abitTestPassingTypeById[this.passingType].name : null
    }

    get canDeleteAdmin() {
        if (this.resultBall || this.resultVerified) {
            return false
        }
        return true
    }

    get createSourceTitle() {
        return AbitWorkplaceMap[this.createSource] && AbitWorkplaceMap[this.createSource].title
    }


    get canDeleteAbit() {
        if (
            this.resultBall ||
            this.resultVerified ||
            this.createSource !== AbitWorkplaceEnum.CIS_ABIT ||
            this.locked
        ) {
            return false
        }
        return true
    }

    get ball() {
        return this.resultBall || this.abitEgeBall || 0
    }

    get resultSourceTypeName() {
        switch (this.resultType) {
            case 'ege':
                return 'Свидетельство ЕГЭ'
            case 'vedomost':
                return 'Ведомость'
            case 'admin':
                return ''
        }
    }

    get resultSourceDocTitle() {
        switch (this.resultType) {
            case 'ege':
                return 'Свидетельство ЕГЭ от ' + dayjs(this.resultDate).format('DD.MM.YYYY')
            case 'vedomost':
                return 'Ведомость ' + this.resultDate
        }
    }

    get canEditAbit() {
        return this.canDeleteAbit
    }

    getService() {
        return this.context.service
    }

    async getSubject(): Promise<EduSubjectModel> {
        if (!this.subject) {
            this.subject = await this.getService().eduSubjectService.query().where({id: this.csubject}).execOne()
        } else if (!this.subjectFetched) {
            this.subjectFetched = true
        }
        return this.subject
    }

    async getAdminActions(user) {

        const result = []

        result.push({
            name: 'view',
            label: 'Просмотр',
            icon: 'fasEye',
            listEvent: 'open',
            type: 'vrouter',
            rowRoot: true,
            path: '/admin/edu/test/' + this._id + '/view',
            access: true
        })

        return result
    }


    get passingTypeAisId() {
        switch (this.passingType) {
            case AbitTestPassingTypeEnum.EGE:
                return 1;
            case AbitTestPassingTypeEnum.INTERNAL:
                return 2;
            case AbitTestPassingTypeEnum.OLIMP:
                return 3;
            case AbitTestPassingTypeEnum.GIA:
                return 4;
        }
    }
}
