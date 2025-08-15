import {arrayProp, index, modelOptions, plugin, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'

import {BaseModel} from "~lib/db/typegoose/base.model";

import {OrderModelState} from './subdoc/state'
import {StepAnket} from './subdoc/anket/doc'
import {StepApplications} from './subdoc/applications/doc'
import {StepSend} from './subdoc/send/doc'
import {OrderChatData} from "./subdoc/chat"
import {OrderModelEpgu} from "./subdoc/epgu"
import {OrderModelFis} from "./subdoc/fis"
import {OrderModelAis} from "./subdoc/ais"
import {EduInstituteModel} from "~modules/edu-org/modules/institute/core/model";
import {UserModel} from "~modules/user/core/model/user.model";
import {AbitOrderTypeModel} from "../order-type/model";
import {
    AbitOrderStatusEnum,
    abitOrderStatusList,
    abitOrderStatusListById
} from "~modules/edu-org/modules/abit/core/order/statics/status";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app/model";
import {EduAppCollection} from "~modules/edu-org/modules/abit/core/app/collection";
import {FileModel} from "~modules/file/core/model";
import {abitOrderFileTypes, abitOrderFileTypesByRole} from "./statics/file-type";
import {AbitOrderModelContext} from "./model-context";
import {TaggerEntityDoc} from "~modules/tagger/core/entity.doc";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
import {AbitAppGroupModel} from "~modules/edu-org/modules/abit/core/app-group/model";
import {ObjectID} from "mongodb";
import {AbitTestModel} from "~modules/edu-org/modules/abit/core/test/model";
import {EduDocModel} from "~modules/edu-org/modules/doc/core/model";
import {AbitAppGroupCollection} from "~modules/edu-org/modules/abit/core/app-group/collection";
import {EduDocRoleEnum, EduDocRolesList} from "~modules/edu-org/modules/doc/core/enum";
import {EduAchievementItemModel} from "~modules/edu-org/modules/achievement/core/item/model";
import {EduSSAppModel} from "~modules/edu-org/modules/ss-app/core/model";
import {AbitFirstAppModel} from "~modules/edu-org/modules/abit/core/app/model-first";
import {aisCitizenTypeByCode, cisCitizenTypeEnum} from "~modules/edu-org/enum/ais-student-status";
import {AbitTestPassingTypeEnum} from "~modules/edu-org/modules/abit/core/test/enum";
import {eduLevelsById} from "~modules/edu-org/modules/level/core/enum";
import {OrderModelLk} from "~modules/edu-org/modules/abit/core/order/subdoc/lk";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core/model";
import {EduCountryModel} from "~modules/edu-org/modules/country/core";
import {EduDecreeModel} from "~modules/edu-org/modules/decree/core/model";

const autoincrement = require('simple-mongoose-autoincrement');
const dayjs = require('dayjs')
const deepGet = require('lodash/get');
const deepSet = require('lodash/set');

export type TOrderPerms = {
    manage: boolean
    personal_edit: boolean
    apps_edit: boolean
    docs_edit: boolean
    test_edit: boolean
    achievements_edit: boolean
}

export class OrderAppError {

    @prop()
    public type: string;

    @prop()
    public competitionUid: string;

    @prop()
    public priority: number;

    @prop()
    public dismatchWith: string;
}


@plugin(paginationPlugin, {
    defaultSortField: 'createAt', defaultSortAscending: false, views: {
        default: ['_id', 'id', 'created', 'title', 'type', 'taxonomy', 'secret'],
        public: ['_id', 'id', 'created', 'title', 'type', 'taxonomy'],
    }
})
@plugin(require('mongoose-named-scopes'))
@plugin(autoincrement, {field: 'nid'})
@modelOptions({
    schemaOptions: {
        collection: "edu_order", discriminatorKey: "eduType", toJSON: {virtuals: true}, toObject: {virtuals: true},
    },
})
@index({regnum: 1}, {unique: true})
export class AbitOrderModel extends BaseModel {

    stepsInfoByCode: object;
    statusesInfoByCode: object;
    stepsFetched: object[];

    _id: ObjectID

    @prop({cfilter: true})
    regnum: number

    @prop()
    deleted: boolean;

    @prop({cfilter: true})
    nid: number

    @prop({})
    userId: string


    @prop({cfilter: true})
    eduType: number

    @prop({cfilter: true})
    cordersource: AbitWorkplaceEnum

    @prop({cfilter: true})
    cinstitute: number

    @prop()
    sendDate: Date

    @prop()
    aisPortedByOperator: Boolean

    @prop()
    aisPorted: Date

    @prop({_id: false, default: {_hold: true}})
    state: OrderModelState

    @prop({cfilter: true})
    coperator?: string

    @prop({_id: false, default: {}})
    chat: OrderChatData

    @prop({default: false, cfilter: true})
    agreementChanged: boolean

    @prop({})
    agreementChangedDate: Date

    @prop({_id: false, default: {}})
    mail: object

    @prop({_id: false, default: {}})
    anket: StepAnket;

    @prop({_id: false, default: {}})
    applications: StepApplications

    @prop({_id: false, default: {}})
    send: StepSend

    @prop({_id: false, default: {}})
    epgu: OrderModelEpgu

    @prop({_id: false, default: {}})
    fis: OrderModelFis

    @prop({_id: false, default: {}})
    ais: OrderModelAis

    @prop({_id: false, default: {}})
    lk: OrderModelLk

    @prop({_id: false, default: {}})
    firstApp: AbitFirstAppModel

    @prop({_id: false, default: {}, cfilter: true})
    cadmissions: number[]

    @prop({_id: false, default: [], cfilter: true, type: () => [Number]})
    csourceList: number[]

    @prop({_id: false, default: {}})
    tagger: TaggerEntityDoc

    @prop({_id: false, default: {_hold: true}})
    subject: object

    createAt: Date
    updateAt: Date

    /* VIRTUALS */
    @prop({ref: UserModel, localField: "userId", foreignField: "_id", justOne: true})
    user?: Ref<UserModel>;

    @prop({ref: AbitOrderTypeModel, localField: "eduType", foreignField: "id", justOne: true})
    orderType?: AbitOrderTypeModel

    @prop({ref: UserModel, localField: "coperator", foreignField: "_id", justOne: true})
    operator?: Ref<UserModel>

    @prop({ref: EduInstituteModel, localField: "cinstitute", foreignField: "id", justOne: true})
    institute?: Ref<EduInstituteModel>

    @prop({ref: () => AbitAppModel, localField: "_id", foreignField: "orderId", justOne: false})
    apps?: AbitAppModel[]

    @prop({ref: () => AbitAppGroupModel, localField: "_id", foreignField: "orderId", justOne: false})
    appGroups?: AbitAppGroupModel[]

    @prop({ref: () => AbitTestModel, localField: "_id", foreignField: "orderId", justOne: false})
    tests?: AbitTestModel[]

    @prop({ref: () => FileModel, localField: "_id", foreignField: "relDocId", justOne: false})
    files?: Ref<FileModel>

    @prop({ref: () => EduDocModel, localField: "_id", foreignField: "orderId", justOne: false})
    docs?: EduDocModel[]

    @prop({ref: () => EduAchievementItemModel, localField: "_id", foreignField: "orderId", justOne: false})
    achievements?: EduAchievementItemModel[]

    @prop({cfilter: true, default: ''})
    podldocOrg: String

    @prop({cfilter: true})
    podldocOrgTransferDate: Date

    @prop({cfilter: true})
    podldocOrgTransferType: number


    @prop({cfilter: true, default: false})
    podldoc: Boolean

    @prop({cfilter: true})
    podldocUpdated: Date

    @prop({cfilter: true})
    podldocRecievedAt: Date

    @prop({cfilter: true})
    podldocCanceledAt: Date

    @prop({cfilter: true, default: false})
    podldocEpgu: Boolean

    @prop({cfilter: true})
    podldocEpguRecieved: Date

    @prop({cfilter: true})
    podldocEpguCanceled: Date

    @prop({cfilter: true})
    podldocEpguUpdated: Date

    @arrayProp({items: OrderAppError, default: []})
    appsErrors: OrderAppError[]

    @prop({cfilter: true})
    zachCompetitionId: number


    @prop({cfilter: true})
    prezachCompetitionId: number

    @prop({cfilter: true, default: 'pending'})
    prezachStatus: string

    @prop({cfilter: true})
    isdop: boolean

    @prop({cfilter: true})
    decreeId: string

    @prop({cfilter: true})
    decreeNid: number

    context: AbitOrderModelContext = {}

    public appGroupsFetched: boolean
    public appsFetched: boolean
    public testsFetched: boolean
    public docsFetched: boolean
    public achievementsFetched: boolean

    public get id() {
        return this._id.toString()
    }

    public getService() {
        return this.context && this.context.service
    }

    public get entityType() {
        return 'edu_order'
    }

    get prezachStatusName() {
        switch (this.prezachStatus) {
            case 'accepted':
                return 'включить в приказ';
            case 'pending':
                return 'на рассмотрении факультета';
            case 'deny':
                return 'отклонить зачисление';
            case 'move':
                return 'перенести в другой конкурс';
        }
    }

    get statusName() {
        return abitOrderStatusListById[this.state.status] ? abitOrderStatusListById[this.state.status].titleAdmin : null
    }

    get citizenType() {
        return aisCitizenTypeByCode[this.anket.personal.citizenship]
    }

    get citizenTypeName() {
        return this.citizenType ? this.citizenType.name : ''
    }

    get ratingId() {
        return [this.ais.aisId, this.nid].filter(part => !!part).join(' / ')
    }

    get fio() {
        return this.getFio()
    }

    get podldocAny() {
        return this.podldoc || this.podldocEpgu
    }

    /* VIRTUALS */

    @prop({ref: () => EduDecreeModel, localField: "decreeNid", foreignField: "nid", justOne: true})
    decree?: EduDecreeModel

    @prop({ref: () => EduCompetitionModel, localField: "prezachCompetitionId", foreignField: "id", justOne: true})
    prezachCompetition?: EduCompetitionModel

    getEduOrigDocDate() {
        return dayjs('2023-08-16', 'YYYY-MM-DD').toDate()

        if (this.podldocEpgu) {
            return this.podldocEpguRecieved || this.podldocEpguUpdated || this.createAt || dayjs('2023-08-16', 'YYYY-MM-DD').toDate()
        } else {
            return this.sendDate || this.createAt || dayjs('2023-08-16', 'YYYY-MM-DD').toDate()
        }
    }

    public get ordersourceName() {

        let name = ''

        switch (this.cordersource) {
            case AbitWorkplaceEnum.EPGU:
                name = 'Абитуриентом в ЕПГУ'
                break;
            case AbitWorkplaceEnum.CIS_ADMIN:
                name = 'Оператором в ЛК'
                break;
            case AbitWorkplaceEnum.CIS_ABIT:
                name = 'Абитуриентом в ЛК'
                break;
            case AbitWorkplaceEnum.AIS:
                name = 'Личный визит'
                break;
            default:
                name = 'Абитуриентом ЛК'
        }

        return name
    }

    public get firstApplication() {
        return this.getFirstApplication()
    }

    async getLastDoneStep() {

        let steps = await this.getStepsFetched();

        let res = null

        for (let i = 0; i < steps.length; i++) {
            let step = steps[i]
            if (!step['done']) {
                break;
            } else {
                res = step
            }
        }

        if (!res) res = steps[0]

        return res
    }

    public get eduTypeSlug() {
        switch (this.eduType) {
            case 1:
                return 'spo'
                break;
            case 2:
                return 'bak'
                break;
            case 3:
                return 'mag'
                break;
            case 4:
                return 'asp'
                break;
        }
    }


    public get eduTypeAppsLimit() {
        switch (this.eduTypeSlug) {
            case 'spo':
                return 1;
            case 'bak':
                return 5;
            case 'mag':
                return 1;
            case 'asp':
                return 1;
        }
    }

    public get eduTypeAchievementsMarkLimit() {
        switch (this.eduTypeSlug) {
            case 'spo':
                return 0;
            case 'bak':
                return 10;
            case 'mag':
                return 30;
            case 'asp':
                return 50;
        }
    }

    public get eduLevels() {
        switch (this.eduType) {
            case 1:
                return [4];
            case 2:
                return [1, 2];
            case 3:
                return [3];
            case 4:
                return [5];
        }
    }

    public get appsTypeKeys() {
        let res: any = {}
        this.applications.items.forEach((app) => {
            switch (app.csource) {
                case 1:
                    res.budget = true;
                    break;
                case 2:
                    res.quota = true
                    break;
                case 4:
                    res.target = true
                    break;
                case 3:
                    res.commerce = true
                    break;
            }
        })
        return res
    }


    public get allFiles() {
        return require('./model-methods/allFiles').default.call(this, 'ddd')
    }

    get filesInfo() {
        return abitOrderFileTypes
    }

    get cfacComputed() {
        return this.firstApp ? this.firstApp.cfac : null
    }

    async addEpguDoc(role, epguUid, localUid = null) {

        let filter

        if (localUid) {
            filter = {
                '_id': localUid
            }
        } else if (epguUid) {
            filter = {
                'relDocId': this._id.toString(),
                'epgu.uid': epguUid,
            }
        } else {
            return
        }

        const doc = await this.getService().fileService.query().where(filter).execOne()

        if (!doc) {
            const roleInfo = abitOrderFileTypesByRole[role]

            await this.getService().fileService.createModel({
                relDocType: 'order',
                relDocId: this._id,
                role: role,
                relDocPath: roleInfo.path,
                epgu: {
                    uid: epguUid
                }
            })
        }
    }

    getFirstApplication() {
        const applications = this.getApplicationsOrdered()
        if (applications.length > 0) {
            return applications[0];
        }
    }

    getApplicationsOrdered() {
        return this.applications.items
    }

    reindexApplications() {

        let index = 1;

        const appsActive = this.applications.items
            .filter(item => !item.deleted)
            .sort((a, b) => ((a.priority > b.priority) ? 1 : -1))
            .map((item) => {
                item.priority = index++;
                return item
            })

        index = 100;

        const appsDeleted = this.applications.items
            .filter(item => !!item.deleted)
            .sort((a, b) => ((a.priority > b.priority) ? 1 : -1))
            .map((item) => {
                item.priority = index++;
                return item
            })

        this.applications.items = [...appsActive, ...appsDeleted]
    }

    ensureFields() {
        return this
    }

    getNextStep(step) {
        const stepInfo = this.getStepInfo(step)

        if (stepInfo) {
            return stepInfo.step
        }
    }

    getCurrentStep() {
        const currentStateStep = this.state['step'] || 'personal'
        return this.getStepInfo(currentStateStep)
    }


    getStepInfo(code) {
        return this.getStepsInfoByCode()[code]
    }

    getStepsInfoByCode(): object {
        return this.stepsInfoByCode ? this.stepsInfoByCode : this.stepsInfoByCode = this.getStepsInfo().reduce((map, o) => (map[o.code] = o, map), {})
    }

    getStateStatusInfo() {
        return this.getStatusInfo(this.state.status || 'draft')
    }

    getStatusInfo(code) {
        return this.getStatusesInfoByCode()[code]
    }

    getStatusesInfoByCode(): object {
        return this.statusesInfoByCode ? this.statusesInfoByCode : this.statusesInfoByCode = this.getStatusesInfo().reduce((map, o) => (map[o.code] = o, map), {})
    }

    getStatusesInfo() {
        return abitOrderStatusList
    }

    setStatus(data, byUserId = null) {
        this.state.status = data.status
        this.state.message = data.message
        this.state.userId = byUserId
        this.state.created = new Date()
    }

    getStepsInfo() {
        return require('./model-methods/getStepsInfo').default.call(this)
    }

    async getStepsFetched() {
        return require('./model-methods/getStepsFetched').default.call(this)
    }

    fileAction(op, path, fileId): boolean {
        return require('./model-methods/fileAction').default.call(this, op, path, fileId)
    }

    updateChatStat(messages) {
        return require('./model-methods/updateChatStat').default.call(this, messages)
    }

    getUserAccess(user) {
        return require('./model-methods/getUserAccess').default.call(this, user)
    }

    setSended(byUserId = null) {
        return require('./model-methods/setSended').default.call(this, byUserId)
    }

    async aisGenerate(ctx) {
        return require('./model-methods/aisGenerate').default.call(this, ctx)
    }

    get canTakeByOperator() {
        return (
            this.sendDate ||
            this.state.status === AbitOrderStatusEnum.SENDED ||
            this.state.status === AbitOrderStatusEnum.DRAFT
        ) && !this.cinstitute && !this.coperator
    }

    getAdminPerms(user: UserModel): TOrderPerms {

        const perms: TOrderPerms = {
            manage: false,
            personal_edit: false,
            apps_edit: false,
            docs_edit: false,
            test_edit: false,
            achievements_edit: false
        }

        if (user.isAdmin) {
            perms['manage'] = true
            perms['personal_edit'] = true
            perms['apps_edit'] = true
            perms['docs_edit'] = true
            perms['test_edit'] = true
            perms['achievements_edit'] = true
            perms['test_result_edit'] = true
        } else if (user.isFac) {
            perms['manage'] = true
            perms['personal_edit'] = true
            perms['apps_edit'] = true
            perms['docs_edit'] = true
            perms['test_edit'] = true
            perms['achievements_edit'] = true
        } else if (user.isOperator) {
            const operatorOwner = this.coperator === user.id
            perms['manage'] = operatorOwner
            perms['personal_edit'] = operatorOwner
            perms['docs_edit'] = operatorOwner
            perms['test_edit'] = false
            perms['apps_edit'] = false
            perms['achievements_edit'] = false
        }

        if (user.login === 'inst_usol@istu.edu' || user.login === 'inst_spo@istu.edu') {
            perms['test_result_edit'] = true
        }

        return perms
    }

    updateEmptyFields(fields, forceUpdate = false) {
        for (let [field, fieldValue] of Object.entries(fields)) {
            let savedFieldValue = deepGet(this, field)

            if (typeof fieldValue === 'string')
                fieldValue = fieldValue.trim()

            if (typeof savedFieldValue === 'string')
                savedFieldValue = savedFieldValue.trim()

            if ((!savedFieldValue || forceUpdate) && fieldValue) {
                deepSet(this, field, fieldValue)
            }
        }
    }

    async getTests(refetch = false): Promise<AbitTestModel[]> {
        if (!this.tests || refetch) {
            this.tests = await this.getService().abitTestService.query().where({orderId: this._id}).exec()
        } else if (!this.testsFetched) {
            this.tests.forEach(app => app.addContext(this.getService().abitTestService.modelContext()))
            this.testsFetched = true
        }
        return this.tests
    }

    async getAchievements(): Promise<EduAchievementItemModel[]> {
        if (!this.achievements) {
            this.achievements = await this.getService().eduAchievementItemService.query().where({orderId: this._id}).withRequired().exec()
        } else if (!this.achievementsFetched) {
            this.achievements.forEach(app => app.addContext(this.getService().eduAchievementItemService.modelContext()))
            this.achievementsFetched = true
        }
        return this.achievements
    }

    async getDocs(refetch = false): Promise<EduDocModel[]> {
        if (!this.docs || refetch) {
            this.docs = await this.getService().eduDocService.query().where({orderId: this._id}).withRequired().exec()
        } else if (!this.docsFetched) {
            this.docs.forEach(app => app.addContext(this.getService().eduDocService.modelContext()))
            this.docsFetched = true
        }
        this.docs.forEach(doc => doc.setOrder(this))
        return this.docs
    }

    async getApps(refetch = false): Promise<AbitAppModel[]> {

        if (!this.apps || refetch) {
            this.apps = await this.getService().abitAppService.query().where({orderId: this._id}).exec()
        } else if (!this.appsFetched) {
            this.apps.forEach(app => app.addContext(this.getService().abitAppService.modelContext()))
            this.appsFetched = true
        }
        return this.apps
    }

    async getAppGroups(refetch = false): Promise<AbitAppGroupModel[]> {
        if (!this.appGroups || refetch) {
            this.appGroups = await this.getService().appGroupService.query().where({orderId: this.id}).execMany()
        } else if (!this.appGroupsFetched) {
            this.appGroups.forEach(app => app.addContext(this.getService().appGroupService.modelContext()))
            this.appGroupsFetched = true
        }
        return this.appGroups.sort((a, b) => (a.isBudget === b.isBudget) ? 0 : a.isBudget ? -1 : 1)
    }

    async ensureAppGroupByEpguApp(epguApp: EduSSAppModel): Promise<AbitAppGroupModel> {
        const appGroup = await this.ensureAppGroup(epguApp.isBudget, epguApp.isDopnabor)
        if (appGroup.epguGuid !== epguApp.guid) {
            appGroup.epguGuid = epguApp.guid
            await appGroup.savePromise()
        }
        return appGroup
    }

    async ensureAppGroup(isBudget: boolean, isdop = false): Promise<AbitAppGroupModel> {

        let foundGroup = (await this.getAppGroups(true)).find(appGroup => {
            return (appGroup.isBudget === isBudget) && (isdop === !!appGroup.isDopnabor)
        })

        if (!foundGroup) {
            foundGroup = this.getService().appGroupService.createModel({})
            foundGroup.isBudget = isBudget
            foundGroup.orderId = this.id
            foundGroup.orderNid = this.nid
            foundGroup.fio = this.getFio()
            foundGroup.snils = this.getSnils()
            foundGroup.isDopnabor = isdop
            await foundGroup.savePromise()
            foundGroup.addContext(this.getService().appGroupService.modelContext())
        }

        return foundGroup
    }

    setApps(apps) {
        return this.apps = apps
    }

    async getAppGroupsCollection(refetch = false): Promise<AbitAppGroupCollection> {
        return new AbitAppGroupCollection(await this.getAppGroups(refetch), this.getService().appGroupService.model, this, this.getService().appGroupService.modelContext())
    }

    async getAppsCollection() {
        return new EduAppCollection(await this.getApps(), this.getService().abitAppService.model, this, this.getService().abitAppService.modelContext())
    }

    isLocal() {
        return true
    }

    isCanceled() {
        return this.deleted || this.getStateStatusInfo().canceled
    }

    wasSendedVuz() {
        return !!this.sendDate
    }

    getSnils() {
        return this.anket.personal.snils || ''
    }


    getPassport() {
        return [this.passportSer, this.passportNum].filter(item => !!item).join('_')
    }

    get passportSer() {
        const ser = (this.anket.personal.doc.serial || '').trim()
        if (ser.match(/([бБ]\/[cС]|[бБ]\\[cС]|[бБ][cС]|без|б\.)/i)) {
            return ''
        } else {
            return ser
        }
    }

    get passportNum() {
        const num = (this.anket.personal.doc.number || '').trim()
        if (num.match('000000')) {
            return ''
        }
        return num
    }

    get snilsReal() {
        if (this.snils.match('000000')) {
            return ''
        } else {
            return this.snils
        }
    }

    get snils() {
        return this.getSnils()
    }

    get passport() {
        return this.getPassport()
    }


    get uid() {
        if (this.snilsReal) {
            return 'СНИЛС_' + this.snilsReal
        } else if (this.passportReal) {
            return 'ПАСПОРТ_' + this.passportReal
        } else {
            return 'ФИО_' + this.fio.toUpperCase()
        }
    }

    get passportReal() {
        if (!this.passportNum) {
            return ''
        } else {
            return this.passport.toUpperCase()
        }
    }

    get phone() {
        return this.anket.personal.phone
    }

    get email() {
        return this.anket.personal.email
    }

    getNid() {
        return this.nid
    }

    getFio() {
        return [
            (this.anket.personal.lastName || '').trim(),
            (this.anket.personal.firstName || '').trim(),
            (this.anket.personal.secondName || '').trim(),
        ].filter(item => !!item).join(' ')
    }

    getEpguTitle() {
        return this.getFio()
    }

    getEpguIdEntrantChoice() {
        if (this.epgu.guid) {
            return {
                Guid: this.epgu.guid
            }
        } else {
            return {
                Snils: this.getSnils()
            }
        }
    }

    async getEpguExtraTestAttribute() {

        if (this.anket.education.prevEduLevel === 4) { // СПО
            return true
        }

        const apps = (await this.getAppsCollection()).getActiveItems()

        for (const app of apps.all()) {
            const compet = await app.getCompetition()
            const adm = await compet.getAdmission()

            for (const subj of adm.subjects) {
                if (subj.cexampasstype === 2 && (subj.csubject < 40)) {
                    return true;
                }
            }
        }

        for (const test of await this.getTests()) {
            if (
                test.passingType === AbitTestPassingTypeEnum.INTERNAL ||
                test.abitPassingType === AbitTestPassingTypeEnum.INTERNAL
            ) {
                return true
            }
        }

        return false;
    }

    getDebugData() {
        return {
            _id: this._id,
            nid: this.nid,
            fio: this.getFio(),
            snils: this.getSnils(),
        }
    }

    getPrintComponentApp() {
        return 'tpl-print-app-' + this.eduTypeSlug
    }

    get isForeigner() {
        return this.anket.personal.citizenship === cisCitizenTypeEnum.FOREIGNER ||
            this.anket.personal.citizenship === cisCitizenTypeEnum.SNG ||
            this.anket.personal.citizenship === cisCitizenTypeEnum.COMPATRIOT
    }

    get docsRoles() {
        return EduDocRolesList.reduce((list, role) => {
            const crole = {
                ...role
            }
            switch (crole.id) {
                case EduDocRoleEnum.PASSPORT:
                    if (this.isForeigner) {
                        crole.epguDefaultDocTypeId = 100040
                    } else {
                        crole.epguDefaultDocTypeId = 100001
                    }
                    break;
            }

            if (role.id === 'compatriot') {
                if (this.anket.personal.citizenship !== 'russia') {
                    list.push(crole)
                }
            } else {
                list.push(crole)
            }

            return list
        }, [])
    }

    async collectEgePassports() {

        const result = []

        if (
            this.anket.personal.firstName &&
            this.anket.personal.lastName &&
            this.anket.personal.secondName
        ) {
            if (this.anket.personal.doc.number && this.anket.personal.doc.serial) {
                const doc: any = {
                    serial: this.anket.personal.doc.serial.trim(),
                    number: this.anket.personal.doc.number.trim(),
                    firstName: this.anket.personal.firstName.trim().toUpperCase(),
                    lastName: this.anket.personal.lastName.trim().toUpperCase(),
                    secondName: this.anket.personal.secondName.trim().toUpperCase(),
                }
                result.push(doc)
            }

            if (this.anket.personal.docEge.number && this.anket.personal.docEge.serial) {
                const doc: any = {
                    serial: this.anket.personal.docEge.serial,
                    number: this.anket.personal.docEge.number,
                    firstName: this.anket.personal.firstName.trim().toUpperCase(),
                    lastName: this.anket.personal.lastName.trim().toUpperCase(),
                    secondName: this.anket.personal.secondName.trim().toUpperCase(),
                }
                result.push(doc)
            }
        }


        const docs = await this.getDocs()

        for (const doc of docs) {


            if (doc.type === EduDocRoleEnum.PASSPORT) {
                const passport: any = {
                    serial: doc.docSeries,
                    number: doc.docNumber,
                    firstName: (doc['fields']['firstName'] || this.anket.personal.firstName || '').trim().toUpperCase(),
                    lastName: (doc['fields']['lastName'] || this.anket.personal.lastName || '').trim().toUpperCase(),
                    secondName: (doc['fields']['secondName'] || this.anket.personal.secondName || '').trim().toUpperCase()
                }

                if (
                    passport.serial &&
                    passport.number &&
                    passport.firstName &&
                    passport.lastName &&
                    passport.secondName) {
                    result.push(passport)
                }

            }
        }

        return result
    }


    getRatingId(app: AbitAppModel) {
        if (this.getSnils() && app.csource !== 5) {
            return this.getSnils()
        } else {
            return this.ais.aisId || this.id
        }
    }

    async updateFirstApp(app: AbitAppModel, save = true) {
        if (app) {
            this.firstApp = app
            if (save)
                await this.savePromise()
        }
    }

    async processMainDocs() {

        let passportDoc: EduDocModel, passportDocFirst
        let eduDoc: EduDocModel, eduDocFirst

        for (const doc of await this.getDocs()) {
            if (doc.type === EduDocRoleEnum.PASSPORT) {
                if (!passportDocFirst)
                    passportDocFirst = doc
                if (doc.isMain)
                    passportDoc = doc
            }
            if (doc.type === EduDocRoleEnum.EDU) {
                if (!eduDocFirst)
                    eduDocFirst = doc
                if (doc.isMain)
                    eduDoc = doc
            }
        }

        passportDoc = passportDoc || passportDocFirst
        eduDoc = eduDoc || eduDocFirst

        if (passportDoc) {
            if (passportDoc.docNumber) {
                this.anket.personal.doc.serial = passportDoc.docSeries
                this.anket.personal.doc.number = passportDoc.docNumber
                this.anket.personal.doc.organization = passportDoc.docOrg
                this.anket.personal.doc.date = passportDoc.issueDate
                this.anket.personal.doc.subcode = passportDoc.subdivisionCode
            }
        }

        if (eduDoc) {
            if (eduDoc.docNumber && this.anket.education.doc.number) {
                this.anket.education.doc.serial = eduDoc.docSeries
                this.anket.education.doc.number = eduDoc.docNumber
                this.anket.education.doc.organization = eduDoc.docOrg
                this.anket.education.doc.date = eduDoc.issueDate
            }
        }
    }

    async fetchAndUpdateFirstApp() {

        const appGroups = await this.getAppGroupsCollection(true)
        const firstApp = await appGroups.getFirstApp()

        await this.updateFirstApp(firstApp, false)

        const cadmissions = {}
        const csources = {}

        for (const appGroup of appGroups.all()) {
            const apps = await appGroup.getActiveAppsCollection()
            for (const app of apps.all()) {
                cadmissions[app.cadmission] = app.cadmission
                csources[app.csource] = app.csource
            }
        }

        this.cadmissions = Object.values(cadmissions)
        this.csourceList = Object.values(csources)

        this.appsErrors = await this.getAppsErrors()

        await this.savePromise()

        return firstApp
    }

    async getEpguIdentDoc() {

        const docs = await this.getDocs()

        let doc: EduDocModel

        for (const _doc of docs) {
            if (_doc.type === EduDocRoleEnum.PASSPORT) {
                if (_doc.docNumber && (!doc || _doc.epgu.guid || _doc.isMain)) {
                    doc = _doc
                }
            }
        }

        return doc
    }

    async getEpguEduDoc() {

        const docs = await this.getDocs()

        let doc: EduDocModel

        for (const _doc of docs) {
            if (_doc.docNumber && (_doc.type === EduDocRoleEnum.EDU)) {
                if (!doc || doc.epgu.guid || doc.isMain) {
                    doc = _doc
                }
            }
        }

        return doc
    }

    async getEpguCitizenshipCountryId() {
        if (this.anket.personal.citizenship === cisCitizenTypeEnum.RUSSIA) {
            return 185
        } else if (this.anket.personal.citizenshipCountry) {
            const citizenshipCountry: EduCountryModel = await this.getService().eduCountryService.model.findOne({nid: this.anket.personal.citizenshipCountry}) as EduCountryModel
            return citizenshipCountry ? citizenshipCountry.epguId : null
        }
    }

    get prevEduLevelName() {
        return eduLevelsById[this.anket.education.prevEduLevel] ? eduLevelsById[this.anket.education.prevEduLevel].name : null
    }

    get portedStatus() {
        return this.lk.portedStatus
    }

    get portedStatusInfo() {
        return this.getStatusesInfoByCode()[this.lk.portedStatus]
    }

    async isFacultyAccepted() {
        if (this.lk.wasAccepted || this.epgu.guid) {
            return true
        }

        switch (this.state.status) {
            case AbitOrderStatusEnum.ACCEPTED:
                return true
                break;
        }

        const apps = await this.getAppsCollection()

        for (const app of apps.all()) {
            if (app.statusId === AppStatusEnum.COMPET_MEMBER) {
                return true
            }
        }

        return false
    }

    async ensureLevelRequiredTests() {

        if (this.eduTypeSlug === 'spo') {

            let foundTest = await this.getService().abitTestService.query().where({
                orderId: this.id,
                csubject: 27
            }).execOne()

            if (!foundTest) {
                foundTest = this.getService().abitTestService.createModel({})
                foundTest.orderId = this.id
                foundTest.orderNid = this.nid
                foundTest.csubject = 27
                foundTest.createSource = AbitWorkplaceEnum.CIS_ABIT
                foundTest.passingType = AbitTestPassingTypeEnum.GIA
                await foundTest.savePromise()
            }

        } else if (this.eduTypeSlug === 'mag') {

            let foundTest = await this.getService().abitTestService.query().where({
                orderId: this.id,
                csubject: 25
            }).execOne()

            if (!foundTest) {
                foundTest = this.getService().abitTestService.createModel({})
                foundTest.orderId = this.id
                foundTest.orderNid = this.nid
                foundTest.csubject = 25
                foundTest.createSource = AbitWorkplaceEnum.CIS_ABIT
                foundTest.passingType = AbitTestPassingTypeEnum.INTERNAL

                foundTest.abitEgeBall = 0
                foundTest.abitEgeReady = false
                foundTest.resultBall = 0
                await foundTest.savePromise()
            }

        } else if (this.eduTypeSlug === 'asp') {

            const csubjects = [17, 29]

            for (const csubject of csubjects) {

                let foundTest = await this.getService().abitTestService.query().where({
                    orderId: this.id,
                    csubject: csubject
                }).execOne()

                if (!foundTest) {
                    foundTest = this.getService().abitTestService.createModel({})
                    foundTest.orderId = this.id
                    foundTest.orderNid = this.nid
                    foundTest.csubject = csubject
                    foundTest.createSource = AbitWorkplaceEnum.CIS_ABIT
                    foundTest.passingType = AbitTestPassingTypeEnum.INTERNAL

                    foundTest.abitEgeBall = 0
                    foundTest.abitEgeReady = false
                    foundTest.resultBall = 0
                    await foundTest.savePromise()
                }
            }

        }

        await this.getTests(true)
    }

    async getAppsErrors() {

        const errors = []

        for (const appGroup of await this.getAppGroups()) {

            const apps = (await appGroup.getActiveAppsCollection()).getItemsSortedByPriority()

            let inAis = {}
            let inEpgu = {}
            let inLk = {}

            let prevPriority = 0

            for (const app of apps) {
                if (app.priority === prevPriority + 1 || app.priority === prevPriority) {

                } else {
                    errors.push({
                        type: 'disordered',
                        competitionUid: app.competitionUid,
                        priority: app.priority,
                    })
                }

                prevPriority = app.priority

                if (app.ais.priority) {
                    inAis[app.competitionUid] = app.ais.priority
                }
                if (app.epgu.priority) {
                    inEpgu[app.competitionUid] = app.epgu.priority
                }
                if (app.lk.priority) {
                    inLk[app.competitionUid] = app.lk.priority
                }
            }

            for (const app of apps) {
                if (Object.keys(inAis).length > 0) {
                    if (app.priority !== inAis[app.competitionUid]) {
                        errors.push({
                            type: 'dismatch',
                            competitionUid: app.competitionUid,
                            priority: app.priority,
                            dismatchWith: 'ais'
                        })
                    }
                }
                if (Object.keys(inEpgu).length > 0) {
                    if (app.priority !== inEpgu[app.competitionUid]) {
                        errors.push({
                            type: 'dismatch',
                            competitionUid: app.competitionUid,
                            priority: app.priority,
                            dismatchWith: 'epgu'
                        })
                    }
                }
                if (Object.keys(inLk).length > 0) {
                    if (app.priority !== inLk[app.competitionUid]) {
                        errors.push({
                            type: 'dismatch',
                            competitionUid: app.competitionUid,
                            priority: app.priority,
                            dismatchWith: 'lk'
                        })
                    }
                }
            }
        }

        return errors
    }
}
