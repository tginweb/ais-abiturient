import {arrayProp, modelOptions, plugin, pre, prop} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";

import {EduInstituteModel} from "~modules/edu-org/modules/institute/core/model";
import {AbitAppModelAis} from "./subdoc/ais";
import {AbitAppModelEpgu} from "./subdoc/epgu";
import {BaseModel} from "~lib/db/typegoose/base.model";
import {AbitWorkplaceEnum, AbitWorkplaceMap} from "~modules/edu-org/enum/source-workplace";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {AppStatusEnum, appStatusListById} from "~modules/edu-org/modules/abit/core/app/enum";
import {AbitAppModelContext} from "./model-context"
import {AbitAppModelAction} from "~modules/edu-org/modules/abit/core/app/subdoc/action";
import {UserModel} from "~modules/user/core/model/user.model";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core/model";
import {AbitAppModelLk} from "~modules/edu-org/modules/abit/core/app/subdoc/lk";
import {AbitAppGroupModel} from "~modules/edu-org/modules/abit/core/app-group/model";

const autoincrement = require('simple-mongoose-autoincrement');

@plugin(paginationPlugin, {
    defaultSortField: 'createAt',
    defaultSortAscending: false,
    views: {
        default: ['_id', 'id', 'created', 'title', 'type', 'taxonomy', 'secret'],
        public: ['_id', 'id', 'created', 'title', 'type', 'taxonomy'],
    }
})
@plugin(require('mongoose-named-scopes'))
@plugin(autoincrement, {field: 'nid'})
@modelOptions({
    schemaOptions: {
        collection: "edu_app",
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    },
})
@pre<AbitAppModel>('save', async function () {

    const app: AbitAppModel = this

    if (this.isNew) {


    }
})
export class AbitAppModel extends BaseModel {

    _id: Number | string

    @prop({cfilter: true})
    nid: number

    @prop({cfilter: true})
    appGroupId: string

    @prop({cfilter: true})
    orderId: string

    @prop({cfilter: true})
    orderNid: number

    @prop({cfilter: true})
    fio: string

    @prop({cfilter: true})
    snils: string

    @prop({cfilter: true})
    clevel: number

    @prop({cfilter: true})
    cfac: number

    @prop({cfilter: true, default: false})
    predZach: boolean

    @prop({cfilter: true, default: 'pending'})
    predZachStatus: string

    @prop({
        default: 0
    })
    priorityNormal: number

    @prop({
        default: 0
    })
    priority: number

    @prop({
        default: 0
    })
    priorityTarget: number

    @prop({
        default: 0
    })
    priorityOther: number

    @prop({cfilter: true})
    statusId: AppStatusEnum

    @prop({cfilter: true})
    competitionId: number

    @prop({cfilter: true})
    competitionUid: string

    @prop({cfilter: true, default: false})
    bvi: boolean

    @prop({cfilter: true, default: false})
    ver: number

    @prop({cfilter: true})
    cadmission: number

    @prop({cfilter: true})
    csource: number

    @prop({cfilter: true})
    cfob: number

    @arrayProp({items: Number})
    specs: number[]

    @prop()
    statusMessage: string

    createAt: Date

    @prop()
    createSource: AbitWorkplaceEnum

    @prop()
    createUserId: string

    @prop()
    cancelSource: AbitWorkplaceEnum

    @prop()
    cancelAt: Date

    @prop()
    cancelReasonId: number

    @prop()
    cancelReasonMessage: string


    @prop({cfilter: true})
    registerAt?: Date

    @arrayProp({items: AbitAppModelAction})
    history: AbitAppModelAction[]

    @prop({_id: false, default: {}})
    ais: AbitAppModelAis

    @prop({_id: false, default: {}})
    epgu: AbitAppModelEpgu

    @prop({_id: false, default: {}})
    lk: AbitAppModelLk


    @prop()
    updateSource: AbitWorkplaceEnum

    @prop({cfilter: true})
    deleted?: boolean

    updateAt: Date

    /* VIRTUALS */

    @prop({ref: () => AbitAppGroupModel, localField: "appGroupId", foreignField: "id", justOne: true})
    appGroup?: AbitAppGroupModel

    @prop({ref: () => EduCompetitionModel, localField: "competitionId", foreignField: "id", justOne: true})
    competition?: EduCompetitionModel

    @prop({ref: () => EduAdmissionModel, localField: "specs", foreignField: "id", justOne: false})
    specsAdmissions?: EduAdmissionModel

    @prop({ref: () => AbitOrderModel, localField: "orderId", foreignField: "_id", justOne: true})
    order?: AbitOrderModel

    @prop({ref: () => EduInstituteModel, localField: "cfac", foreignField: "id", justOne: true})
    fac?: EduInstituteModel

    public appGroupFetched: Boolean
    public orderFetched: Boolean
    public competitionFetched: Boolean
    public context: AbitAppModelContext = {}

    getService() {
        return this.context && this.context.service
    }

    get id() {
        return this._id.toString()
    }

    get hash() {
        return this.statusId + '.' + this.priority
    }

    get registerAtComputed() {

        let maxDate

        const dates = [
            this.ais.registerAt || 0,
            this.lk.registerAt || 0,
            this.epgu.registerAt || 0
        ].filter(date => !!date)

        if (dates.length) {
            maxDate = Math.max.apply(null, dates)
        }

        return maxDate || this.registerAt || this.createAt
    }

    get createSourceTitle() {
        return AbitWorkplaceMap[this.createSource] && AbitWorkplaceMap[this.createSource].title
    }

    get isCanceled() {
        return appStatusListById[this.statusId] ? appStatusListById[this.statusId].canceled : null
    }

    get status() {
        return appStatusListById[this.statusId]
    }

    get statusTitle() {
        return appStatusListById[this.statusId] ? appStatusListById[this.statusId].title : null
    }

    get isZach() {
        return this.statusId === AppStatusEnum.INORDER || this.statusId === AppStatusEnum.STUDENT
    }

    get canDelete() {
        if (
            this.statusId !== AppStatusEnum.NEW ||
            this.epgu.guid ||
            this.ais.priority ||
            this.createSource !== AbitWorkplaceEnum.CIS_ABIT
        ) {
            return false
        }
        return true
    }

    get isBudget() {
        return this.csource !== 3
    }

    async getAppGroup(refetch = false): Promise<AbitAppGroupModel> {
        if (!this.appGroup) {
            this.appGroup = await this.getService().appGroupService.query().getById(this.appGroupId)
        } else if (!this.appGroupFetched) {
            this.appGroup.addContext(this.getService().appGroupService.modelContext())
            this.appGroupFetched = true
        }
        return this.appGroup
    }

    async getOrder(refetch = false): Promise<AbitOrderModel> {
        if (!this.order && !this.orderFetched || refetch) {
            this.order = await this.getService().abitOrderService.query().getById(this.orderId)
            this.orderFetched = true
        }
        return this.order
    }

    async getCompetition(refetch = false): Promise<EduCompetitionModel> {

        if (!this.context || !this.getService()) {
            return this.competition
        }

        if (!this.competition) {
            this.competition = await this.getService().eduCompetitionService.query().withViewPublic().getByNid(this.competitionId)
        } else if (!this.competitionFetched) {
            this.competition.addContext(this.getService().eduCompetitionService.modelContext())
            this.competitionFetched = true
        }
        return this.competition
    }

    setOrder(order) {
        return this.order = order
    }

    getDebugData() {
        return {
            nid: this.nid,
            orderId: this.orderId,
        }
    }

    updateState(state, source: AbitWorkplaceEnum, user: UserModel = null, params: any = {}) {

        const historyAction: AbitAppModelAction = <AbitAppModelAction>{}

        const fields = ['statusStage', 'cstatus', 'priority', 'agree', 'agreeDeny', 'cancelSource']

        if (user)
            historyAction.userId = user.id

        historyAction.source = source
        historyAction.createAt = new Date(Date.now())
        historyAction.message = params.message

        historyAction.from = {
            ...historyAction.from,
            statusId: this.statusId,
            priority: this.priority,
            cancelSource: this.cancelSource,
        }

        historyAction.to = {
            ...historyAction.to,
            statusId: state.statusId || this.statusId,
            priority: state.priority || this.priority,
            cancelSource: state.cancelSource || this.cancelSource,
        }

        for (const field of fields) {
            if (state[field])
                this[field] = state[field]
        }

        this.history.push(historyAction)
    }

    queueServiceSend() {
        this.epgu.serviceSend = new Date()
        this.epgu.serviceSendHash = this.hash
        this.epgu.serviceSendResult = null
    }

    async getAdminActions(user) {

        const result = []

        result.push({
            label: 'Перенести текст причины',
            confirm: true,
            type: 'dispatch',
            path: 'edu_app/actionMultiple',
            argsIdMultiple: true,
            group: true,
            args: {
                action: 'copy_reason_message'
            }
        })

        return result
    }

    async cancelReasonTitle() {
        if (this.cancelReasonId) {
            const term = (await this.getService().epguDictionaryService.getTermsByTaxIndexed('ReasonsRejectionCls'))[this.cancelReasonId]
            if (term)
                return term.name
        }
    }
}
