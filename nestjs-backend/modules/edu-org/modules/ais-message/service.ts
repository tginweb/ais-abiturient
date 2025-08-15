import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduAisMessageModel as Model} from "./model";
import {EduAisMessageQuery as ModelQuery} from "./query";
import {EntityService} from "~modules/entity/entity.service";
import {EduAisService} from "~modules/edu-org/modules/ais/core/service";
import {AbitAppAdminService} from "~modules/edu-org/modules/abit/admin/app/service";
import {promisify} from "util";
import * as fs from 'fs'
import {EduSSEntrantService} from "~modules/edu-org/modules/ss-entrant/core/service";
import {EduSSAppService} from "~modules/edu-org/modules/ss-app/core/service";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order/service";
import {EduDocService} from "~modules/edu-org/modules/doc/core/service";
import {EduCompetitionService} from "~modules/edu-org/modules/competition/core";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core";

const path = require('path')
const xml2js = require('xml2js');
const dayjs = require('dayjs')
const readFile = promisify(fs.readFile)

@Injectable()
export class EduAisMessageService {

    getFiltersTree = require('./service-methods/getFiltersTree').default

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        @Inject(forwardRef(() => EntityService))
        private entityService: EntityService,
        public aisApi: EduAisService,
        public abitOrderService: AbitOrderService,
        public abitAppService: AbitAppAdminService,
        public eduSSEntrantService: EduSSEntrantService,
        public eduSSAppService: EduSSAppService,
        public eduDocService: EduDocService,
        public competitionService: EduCompetitionService,
        public admissionService: EduAdmissionService,
    ) {
        this.entityService.registerEntityType('ais_message', {
            label: '',
            find: this.find.bind(this),
            findOneBy: this.findOne.bind(this),
            create: this.createModel.bind(this),
            context: this.getModelContext()
        })
    }

    getModelContext(): any {
        return {
            aisApiService: this.aisApi,
            modelService: this,
            entityService: this.entityService,
            orderService: this.abitOrderService,
            service: this,
        }
    }

    async find<T>(filter: any = null, nav: any = null, view = 'public'): Promise<Model[]> {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withView(view)
            .exec()
    }

    async findOne<T>(filter: any = null, nav: any = null, view = 'public'): Promise<Model> {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withView(view)
            .findOne()
            .exec()
    }

    createModel<T>(data: Model): Model {
        return new this.model(data)
    }

    query() {
        return new ModelQuery(this.model.find())
    }

    async findOrCreateByIdJwt(queueName, idJwt) {

        let message = await this.findOne({idJwt: idJwt})

        if (!message) {
            message = this.createModel(<Model>{
                idJwt: idJwt,
                queue: queueName
            })
            await message.savePromise()
        }

        message.setContext(this.getModelContext())

        return message
    }


    async importQueue() {

        console.log('importQueue')

        const res: any = await this.aisApi.tokenDespatchGet()

        if (res && res.IdJwtList && res.IdJwtList.List) {

            const idJwts = res.IdJwtList.List

            if (idJwts && idJwts.length) {

                for (let i = 0; i < idJwts.length; i++) {

                    const idJwt = idJwts[i]

                    let message = await this.findOne({idJwt: idJwt})

                    if (!message) {

                        console.log(idJwt)

                        message = this.createModel(<Model>{
                            idJwt: idJwt,
                            queue: 'ais',
                            state: {
                                step: 'fetch',
                                status: 'await'
                            }
                        })
                        await message.savePromise()
                    }
                }
            }
        }

    }

    async jsonToXml(data) {

        const builder = new xml2js.Builder();

        let result = builder.buildObject(data);

        result = result.replace(/\<\?xml.+?\?\>/gi, '')

        return result
    }

    async entityAction(action, entity: Model, params = {}) {
        entity.addContext(this.getModelContext())
        return this['entityAction_' + action](entity, params)
    }

    async entityAction_delete(entity: Model, params = {}) {
        return this.model.deleteOne({_id: entity._id})
    }

    async entityAction_process(entity: Model, params: any = {}) {
        return entity.process(params.step, params.status)
    }

    async entityAction_archive(entity: Model, params: any = {}) {
        entity.archive = true
        await entity.savePromise()
    }

    async entityAction_unarchive(entity: Model, params: any = {}) {
        entity.archive = false
        await entity.savePromise()
    }


    async createMessage(messageType, args = {}) {

        const doc = this.createModel(<Model>{
            queue: 'service',
            type: messageType,
            args: args
        })

        await doc.savePromise()
        return doc
    }

    async createMessageFromArgs(messageType, args) {

        console.log('createMessageFromArgs')

        let doc: Model = await this.createModel(<Model>{
            queue: 'service',
            type: messageType,
            args: args
        })

        await doc.savePromise()

        const docId = doc._id

        doc = await this.query().getById(docId)

        console.log(doc.aisEntityType)

        if (doc._id['toString']() !== docId['toString']())
            return false;

        doc.addContext(this.getModelContext())

        doc.fillRequestHeader()

        await doc.getToken()

        await doc.savePromise()

        return doc
    }

    async createMessageFromEntities(messageType, entityType, entities) {

        const entityIds = entities.map(entity => entity._id)

        let doc: Model = await this.createModel(<Model>{
            queue: 'service',
            type: messageType,
            args: {
                entityType: entityType,
                entityIds: entityIds,
            }
        })

        await doc.savePromise()

        const docId = doc._id

        doc = await this.query().getById(docId)

        if (doc._id['toString']() !== docId['toString']())
            return false;

        doc.addContext(this.getModelContext())

        doc.fillRequestHeader()

        await doc.getToken()

        await doc.savePromise()

        return doc
    }


    async createMessageFromEntity(messageType, entityType, entity) {

        let doc: Model = await this.createModel(<Model>{
            queue: 'service',
            type: messageType,
            args: {
                entityType: entityType,
                entityId: entity._id,
            }
        })

        if (doc['generateChilds']) {
            doc.addContext(this.getModelContext())
            await doc['generateChilds']()
            return;
        }

        await doc.savePromise()

        const docId = doc._id

        doc = await this.query().getById(docId)

        if (doc._id['toString']() !== docId['toString']())
            return false;

        doc.addContext(this.getModelContext())

        await doc.fillArgs(entity)

        doc.fillRequestHeader()

        const payload: any = await doc.getPayload()

        if (payload === false) {
            await doc.deletePromise()
            return;
        }

        await doc.getToken()

        await doc.savePromise()

        return doc
    }

    getNestedDoc(data, path = []) {
        const docs = this.getNestedDocs(data, path)
        return docs.length ? docs[0] : null
    }

    getNestedDocs(data, path = []) {

        if (!data)
            return null;

        let child = data

        for (const pathItem of path) {
            child = child[pathItem]
            if (child) {
                if (Array.isArray(child)) {
                    return child
                }
            } else {
                return []
            }
        }

        return child ? (!Array.isArray(child) ? [child] : child) : []
    }

    extractAisDate(value) {
        if (!value)
            return null;
        const [strDate, strTime] = value.split(' ')
        return strDate
    }

    extractAisYear(value) {
        return dayjs(value, 'YYYY-MM-DD HH:mm:ss.SSS').format('YYYY-MM-DD')
    }

    extractAisDatetime(value) {
        return dayjs(value, 'YYYY-MM-DD HH:mm:ss.SSS').format()
    }
}
