import {modelOptions, plugin, pre, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from "~lib/db/typegoose/base.model";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
import {AbitAppGroupModelContext} from "./model-context"
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app/model";
import {EduAppCollection} from "~modules/edu-org/modules/abit/core/app/collection";
import {ObjectID} from "mongodb";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";

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
        collection: "edu_app_group",
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    },
})
@pre<AbitAppGroupModel>('save', async function () {

    const app: AbitAppGroupModel = this

    if (this.isNew) {

    }
})
export class AbitAppGroupModel extends BaseModel {

    _id: ObjectID

    @prop({cfilter: true})
    nid: number

    @prop({cfilter: true})
    orderId: string

    @prop({cfilter: true})
    orderNid: number

    @prop({cfilter: true})
    fio: string

    @prop({cfilter: true})
    snils: string

    @prop({cfilter: true})
    isBudget: boolean

    @prop({cfilter: true})
    isDopnabor: boolean

    @prop({cfilter: true})
    sendDate?: Date

    @prop()
    registerAt?: Date;

    @prop()
    registerSource: AbitWorkplaceEnum

    @prop()
    createUserId: string

    @prop({cfilter: true})
    epguGuid?: string

    @prop({cfilter: true})
    epguState?: string // 'sended'

    @prop({ref: () => AbitAppModel, localField: "_id", foreignField: "appGroupId", justOne: false})
    apps?: AbitAppModel[]

    @prop({ref: () => AbitOrderModel, localField: "orderId", foreignField: "_id", justOne: true})
    order?: Ref<AbitOrderModel>

    @prop({cfilter: true})
    deleted?: boolean

    createAt: Date
    updateAt: Date

    public appsFetched: boolean

    public context: AbitAppGroupModelContext = {}

    get id() {
        return this._id.toString()
    }

    getService() {
        return this.context && this.context.service
    }

    get name() {
        return 'Заявление №' + this.nid + ' на ' + (this.isBudget ? 'бюджет' : 'коммерческий')
    }

    async getCanceledAppsCollection(refetch = false): Promise<EduAppCollection> {
        const apps = await this.getAppsCollection(refetch)
        return apps.getCanceledItems()
    }

    async getActiveAppsCollection(refetch = false): Promise<EduAppCollection> {
        const apps = await this.getAppsCollection(refetch)
        return apps.getActiveItems()
    }

    async getAppsCollection(refetch = false): Promise<EduAppCollection> {
        return new EduAppCollection(await this.getApps(refetch), this.getService().abitAppService.model, this, this.getService().abitAppService.modelContext())
    }

    async getApps(refetch = false): Promise<AbitAppModel[]> {
        if (this.getService()) {
            if (!this.apps || refetch) {
                this.apps = await this.getService().abitAppService.query().where({appGroupId: this._id}).exec()
            } else if (!this.appsFetched) {
                this.apps.forEach(app => app.addContext(this.getService().abitAppService.modelContext()))
                this.appsFetched = true
            }
        }
        return this.apps
    }
}
