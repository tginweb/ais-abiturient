import {modelOptions, plugin, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from '~lib/db/typegoose/base.model'
import {DocResponse} from './model/response'
import {DocState} from './model/state'
import {DocRequest} from './model/request'
import {DocRequestHeader} from './model/request-header'
import {DocArgs} from './model/args'

import {ObjectID} from "mongodb";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {EduAisMessageService} from "./service";
import {AbitAppGroupModel} from "~modules/edu-org/modules/abit/core/app-group";
import * as fs from "fs";


const path = require('path')
const dayjs = require('dayjs')

const camelCase = require('camelcase');

const autoincrement = require('simple-mongoose-autoincrement');
const xml2js = require('xml2js');

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
})
@plugin(autoincrement, {field: 'id'})
@plugin(require('mongoose-named-scopes'))
@modelOptions({
    schemaOptions: {
        collection: "ais_message",
        discriminatorKey: "type",
        toObject: {virtuals: true},
    }
})
export class EduAisMessageModel extends BaseModel {

    getPersonFio() {
        return ''
    }

    getPersonIdent() {
        return ''
    }

    _id: ObjectID

    @prop()
    id: number;

    @prop({cfilter: true})
    type: string

    @prop({_id: false, default: {}})
    args: DocArgs

    @prop({cfilter: true})
    idJwt: number;

    @prop({cfilter: true})
    queue: string;

    @prop({})
    infoToken: string

    @prop({_id: false, default: {}})
    request: DocRequest

    @prop({_id: false, default: {}})
    response: DocResponse

    @prop({_id: false, default: {}})
    state: DocState;

    @prop({default: false, cfilter: true})
    archive: boolean

    @prop({ref: () => AbitOrderModel, localField: "args.orderId", foreignField: "_id", justOne: true})
    order?: Ref<AbitOrderModel>

    @prop({ref: () => AbitOrderModel, localField: "response.GuidEntrant", foreignField: "a.guid", justOne: true})
    entrantOrder?: Ref<AbitOrderModel>

    @prop({
        ref: () => AbitAppGroupModel,
        localField: "response.GuidApplication",
        foreignField: "aisGuid",
        justOne: true
    })
    entrantApp?: Ref<AbitAppGroupModel>

    public argEntity = null

    public context: any = {
        service: EduAisMessageService,
    }
    public get service() {
        return this.context && this.context.service
    }
    public get typeName() {
        return 'SSSS'
    }

    public get entityType() {
        return 'ais_message'
    }

    get getStateStepId() {
        return {
            send: 1,
            fetch: 2,
            process: 3,
            done: 4
        }[this.state.step] || 0
    }

    get getStateStatusId() {
        return {
            await: 1,
            process: 2,
            error: 8,
            success: 9
        }[this.state.status] || 0
    }

    get getStateStepStatusId() {
        return parseInt(this.getStateStepId.toString() + this.getStateStatusId.toString())
    }

    get aisAction() {
        return null
    }

    get aisEntityType() {
        return null
    }

    getActions() {
        return require('./model-methods/getActions').default.call(this)
    }

    setContext(context) {
        this.context = context
    }

    isSended() {
        return this.getStateStepStatusId >= 19
    }

    isFetched() {
        return this.getStateStepStatusId >= 28
    }

    isProcessed() {
        return this.getStateStepStatusId >= 39
    }

    isResultSuccess() {
        return this.response.header?.PayloadType === 'success'
    }

    async getToken(refetch = false) {
        if (!this.request.token || refetch || 1) {
            this.request.token = await this.context.aisApiService.tokenGenerate(this.request.header['toJSON'](), await this.getPayloadXml())
        }
        return this.request.token
    }

    async getInfoToken(refetch = false) {

        if (!this.infoToken || refetch) {
            this.infoToken = await this.context.aisApi.tokenGenerate({
                Action: 'GetMessage',
                IdJwt: this.idJwt
            }, null)
        }

        return this.infoToken
    }

    isState(step, status?) {
        return this.state.step === step && (!status || status === this.state.status)
    }

    async updateState(data, save = false) {

        if (typeof data.statusMessage !== 'undefined') {
            if (!data.statusMessage) {
                data.statusMessage = []
            } else if (typeof data.statusMessage === 'string') {
                data.statusMessage = [data.statusMessage]
            }
        }

        Object.assign(this.state, data)
        if (save) {
            await this.savePromise()
        }
    }

    async callMethod(name, arg?) {
        if (this[name]) {
            return await this[name]()
        }
        const cname = camelCase(name, {})
        if (this[cname]) {
            return await this[cname](arg)
        }
    }

    async process(step = null, status = null) {


        try {

            let force = false

            if (step) {

                force = true

                await this.updateState({
                    processed: false,
                    running: true,
                })

                step = step || this.state.step
                status = status || 'await'

            } else {

                if (this.state.processed) return

                await this.updateState({
                    running: true,
                }, true)

                step = this.state.step
                status = this.state.status
            }

            const hooks = []

            hooks.push(step + '_' + status)

            if (status === 'await' || status === 'process') {
                hooks.push(step)
            }

            for (const hook of hooks) {
                const res = await this.callMethod('on_' + hook, force)
                if (res === false) break
            }

        } catch (e) {
            console.log(e)

            //await this.updateState({status: 'error', queue: false})
        }

        await this.updateState({
            running: false
        }, true)

        return true
    }

    getMeta() {
        return {
            header: this.request.header,
            args: this.args
        }
    }

    async onSend() {

        const asyncMode = false

        let res

        if (asyncMode) {
            this.context.aisApiService.tokenNew(await this.getToken(), {...this.getMeta(), async: true})
        } else {
            res = await this.context.aisApiService.tokenNew(await this.getToken(), this.getMeta())
        }

        if (res) {

            if (res.IdJwt) {

                this.idJwt = parseInt(res.IdJwt)

                await this.updateState({
                    step: 'fetch',
                    status: 'await',
                    statusMessage: ''
                })

            } else {

                await this.updateState({
                    step: 'send',
                    status: 'error',
                    statusMessage: res.error,
                    processed: true
                })
            }

            //await this.targetEntityUpdateState()

        } else {

        }
    }

    async onFetch(force = false) {
        await this.fetchResult(force)
    }

    async onProcess(force = false) {
        await this.processResult(force)
    }

    async fetchResult(refetch = false) {


        if (this.getStateStepStatusId < 19) {
            return false
        }

        if ((this.getStateStepStatusId >= 38) && !refetch) {
            return this.getStateStepStatusId === 39
        }

        let token: DocResponse

        if (!this.response.payloadXml) {

            const res = await this.context.aisApiService.getTokenInfo(this.queue, this.idJwt)

            if (res && res.Token) {

                token = await this.context.aisApiService.responseTokenDecode(res.Token)

                token.payload = await this.context.aisApiService.responsePayloadToJson(token.payloadXml)
            } else {
                console.log(res)
            }

        } else {

            token = this.response
            token.payload = await this.context.aisApiService.responsePayloadToJson(token.payloadXml)
        }

        if (token) {


            if (token.header && token.header.IdJwt) {

                if (!this.request.header.Entity) {
                    this.request.header.Entity = token.header.EntityType
                    this.request.header.Action = token.header.Action
                }

                if (!this.type && typeof token.header.Entity === 'string') {
                    this.type = token.header.Entity
                }

                let resultStatus = 'success'

                this.response.header = token.header

                if (token.header.Entity) {
                    this.response.header.Entity = token.header.Entity
                }

                if (token.payload) {

                    let payload = {}

                    if (typeof token.payload === 'object' && token.payload['PackageData']) {
                        payload = token.payload['PackageData']
                    } else {
                        payload = token.payload
                    }

                    this.response.payload = payload

                    const payloadContent: any = this.response.payload[this.response.header.Entity]

                    if (payloadContent) {

                        console.log(payloadContent.Entrant.GuidEntrant)

                        if (payloadContent.Entrant && payloadContent.Entrant.GuidEntrant)
                            this.response.GuidEntrant = payloadContent.Entrant.GuidEntrant

                        if (payloadContent.GuidApplication)
                            this.response.GuidApplication = payloadContent.GuidApplication

                        if (payloadContent.GuidEntrant)
                            this.response.GuidEntrant = payloadContent.GuidEntrant
                    }

                } else {
                    this.response.payload = null
                }

                const statusMessage = []

                //console.log('ddddddd')
                //console.log(this.response.header.PayloadType)

                if (this.response.header.PayloadType === 'error') {

                    resultStatus = 'error'

                    if (this.response.payload && this.response.payload['Error']) {

                        const payloadError = this.response.payload['Error']

                        if (Array.isArray(payloadError)) {
                            Array.prototype.push.apply(statusMessage, this.response.payload['Error'].map(item => item.Description))
                        } else if (typeof payloadError === 'object') {
                            statusMessage.push(payloadError.Description)
                        } else if (typeof payloadError === 'string') {
                            statusMessage.push(payloadError)
                        }
                    }
                }

                if (resultStatus === 'success') {
                    await this.updateState({
                        step: 'process',
                        status: 'await',
                        statusMessage: statusMessage
                    })
                    // await this.processResult()
                } else {
                    await this.updateState({
                        step: 'fetch',
                        status: 'error',
                        statusMessage: statusMessage,
                        processed: true
                    })
                    //await this.targetEntityUpdateState()
                }

                return true
            }
        }
    }

    async processResult(reprocess = false) {


        if (this.getStateStepStatusId < 29) {
            return false
        }

        if ((this.getStateStepStatusId < 29) && !reprocess) {
            return this.getStateStepStatusId > 29
        }

        const isSuccess = this.response.header.PayloadType !== 'Error'

        let processedResult = true

        if (isSuccess) {
            if (this['onProcessResult']) {
                processedResult = await this['onProcessResult']()
            }
            if (processedResult !== true) {
                await this.updateState({
                    step: 'process',
                    status: 'error',
                    statusMessage: processedResult,
                    processed: true,
                })
            } else {
                await this.updateState({
                    step: 'done',
                    status: 'success',
                    statusMessage: '',
                    processed: true,
                })
            }
        } else {
            if (this['onProcessResultError']) {
                await this['onProcessResultError']()
            }
            await this.updateState({
                step: 'done',
                status: 'error',
                statusMessage: '',
                processed: true,
            })
        }

        return;
    }

    public async fillPayload() {

    }

    async getArgEntity() {
        if (!this.argEntity) {
            if (this.args['entityId']) {
                const query = this.context.entityService.query(this.args['entityType']).withViewPublic()
                if (query) {
                    this.argEntity = await query.getById(this.args['entityId']) || false
                    if (this.argEntity) {
                        this.argEntity.addContext(this.context)
                    }
                }
            }
        }
        return this.argEntity
    }

    async getArgEntities() {
        let entities = []
        if (this.args.entityIds) {
            const query = this.context.entityService.query(this.args.entityType)
            if (query) {
                //entities = await query.withViewPublic().filterIds({ids: this.args.entityIds}).exec()
                entities = await query.filterIds({ids: this.args.entityIds}).exec()
            }
        }
        return entities
    }

    jsonToXml(data) {

        const builder = new xml2js.Builder();

        let result = builder.buildObject(data);

        //result = result.replace(/\<\?xml.+?\?\>/gi, '')
        result = result.replace(/\<root\>/gi, '<Root>')
        result = result.replace(/\<\/root\>/gi, '</Root>')

        return result
    }

    async getPayload(refetch = false) {
        if (!this.request.payload || refetch) {
            this.request.payload = await this.generatePayload()
        }
        return this.request.payload
    }

    // @ts-ignore
    async generatePayload() {
        return {}
    }

    async getPayloadXml(refetch = false) {
        if (!this.request.payloadXml || refetch) {
            this.request.payloadXml = await this.jsonToXml({
                AuthData: {
                    Login: 'cpk@istu.edu',
                    Pass: 'oknBvzg',
                    InstitutionID: 192
                },
                PackageData: await this.getPayload(refetch),
            })

            const fileDir = path.join(process.cwd(), 'ais-packet')

            const fileName = dayjs().format('YYYY-MM-DD-HH-mm') + '.xml'

            const filePath = fileDir + '/' + fileName

            await fs.promises.writeFile(filePath, this.request.payloadXml)

        }
        return this.request.payloadXml
    }

    fillRequestHeader(header: DocRequestHeader = {}) {
        this.request.header.Entity = header.Entity || this.aisEntityType
        this.request.header.Action = header.Action || this.aisAction
    }

    fillEntityArgs(entity) {
        this.args.entityId = entity._id
        this.args.entityNid = entity.getNid && entity.getNid()
        this.args.entityTitle = entity.getAisTitle && entity.getAisTitle()
    }

    async fillArgs(entity) {
        this.fillEntityArgs(entity)
    }

    async getOrder(): Promise<AbitOrderModel> {
        return await this.service.abitOrderService.query().withViewAdmin().getById(this.args.orderId)
    }

    convertAisDate(date, format = 'DD.MM.YYYY') {
        return dayjs(date, 'YYYY-MM-DD').format(format)
    }

    getArray(data) {
        if (data) {
            return Array.isArray(data) ? data : [data]
        } else {
            return []
        }
    }

}
