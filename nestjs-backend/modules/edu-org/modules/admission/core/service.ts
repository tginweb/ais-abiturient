import {Injectable} from '@nestjs/common'
import {InjectModel} from "nestjs-typegoose"
import {ReturnModelType} from "@typegoose/typegoose"
import {EduAdmissionModel, EduAdmissionModel as Model} from "./model";
import {EduAdmissionQuery as ModelQuery} from './query'
import {EntityService} from "~modules/entity/entity.service"
import {EduDirectionService} from "~modules/edu-org/modules/direction/core/service"
import {EduFobService} from "~modules/edu-org/modules/fob/core/service";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";

@Injectable()
export class EduAdmissionService {

    public allCache = null
    public allIndexedCache = null

    public aisHistoryAdmissions = null

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        public entityService: EntityService,
        public serviceEduDirection: EduDirectionService,
        public eduFobService: EduFobService,
        public aisService: EduAisService
    ) {
        this.entityService.registerEntityType('edu_admission', {
            label: '',
            find: this.find.bind(this),
            findOne: this.findOne.bind(this),
            service: this,
            query: this.query.bind(this),
        })
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

    createModel<T>(data: any): Model {
        return new this.model(data)
    }

    getQueryContext() {
        return {
            serviceEduDirection: this.serviceEduDirection,
            entityService: this.entityService
        }
    }

    modelContext(): any {
        return {
            service: this
        }
    }

    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.modelContext())
    }


    async getAllCached() {
        if (!this.allCache) {
            this.allCache = await this.query().where().exec()
        }
        return this.allCache
    }

    async getAllIndexedCached() {
        if (!this.allIndexedCache) {
            this.allIndexedCache = (await this.getAllCached()).reduce((map, item) => {
                map[item.id] = item
                return map
            }, {})
        }
        return this.allIndexedCache
    }

    public async getByIdCached(id) {

        return (await this.getAllIndexedCached())[id]
    }

    async getAisHistoryAdmissions() {
        if (!this.aisHistoryAdmissions) {
            const rep = this.aisService.getRepository()
            this.aisHistoryAdmissions = await rep.selectAllFrom('all_catadmission')
        }
        return this.aisHistoryAdmissions
    }

    async getAisHistoryAdmissionsById() {

        const admissions = await this.getAisHistoryAdmissions()

        return admissions.reduce((map, item)=>{
            map[item.id] = item
            return map
        }, {})
    }
}
