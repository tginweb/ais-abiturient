import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduSheetModel as Model} from "./model";
import {EduSheetQuery as ModelQuery} from './query'
import {EntityService} from "~modules/entity/entity.service";
import {EduDirectionService} from "~modules/edu-org/modules/direction/core/service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {EduSourceService} from "~modules/edu-org/modules/source/core/service";
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app/service";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order/service";
import {EduSubjectService} from "~modules/edu-org/modules/subject/core/service";

@Injectable()
export class EduSheetService {

    public allCache = null
    public allIndexedCache = null

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,
        public serviceEduDirection: EduDirectionService,
        public serviceEduAdmission: EduAdmissionService,
        public serviceEduFob: EduSourceService,
        public serviceEduSource: EduSourceService,
        @Inject(forwardRef(() => AbitOrderService))
        public orderService: AbitOrderService,
        @Inject(forwardRef(() => AbitAppService))
        public appService: AbitAppService,
        public subjectService: EduSubjectService,
    ) {
        this.entityService.registerEntityType('edu_sheet', {
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

    getQueryContext(user) {
        return {
            serviceEduDirection: this.serviceEduDirection,
            entityService: this.entityService,
            user: user
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
}
