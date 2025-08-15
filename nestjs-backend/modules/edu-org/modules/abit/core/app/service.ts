import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitAppModel as Model} from "./model";
import {EntityService} from "~modules/entity/entity.service";
import {AbitAppQuery as ModelQuery} from "./query";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order/service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {EduSourceService} from "~modules/edu-org/modules/source/core/service";
import {EduFobService} from "~modules/edu-org/modules/fob/core/service";
import {AbitAppModelContext} from "~modules/edu-org/modules/abit/core/app/model-context";
import {EduCompetitionService} from "~modules/edu-org/modules/competition/core/service";
import {EduEpguDictionaryService} from "~modules/edu-org/modules/epgu-dictionary/core/service";
import {AbitAppGroupService} from "~modules/edu-org/modules/abit/core/app-group/service";


@Injectable()
export class AbitAppService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,
        @Inject(forwardRef(() => AbitOrderService))
        public abitOrderService: AbitOrderService,
        public appGroupService: AbitAppGroupService,
        public eduAdmissionService: EduAdmissionService,
        public eduSourceService: EduSourceService,
        public eduFobService: EduFobService,
        @Inject(forwardRef(() => EduCompetitionService))
        public eduCompetitionService: EduCompetitionService,
        public readonly epguDictionaryService: EduEpguDictionaryService,
    ) {
        this.entityService.registerEntityType('edu_app', {
            label: '',
            service: this,
        })
    }

    createModel(data: Model): Model {
        return new this.model(data)
    }

    createModelWithContext(data: Model): Model {
        return this.createModel(data).addContext(this.modelContext())
    }

    deleteModel(model: Model) {
        return model.deletePromise()
    }

    modelContext(): AbitAppModelContext {
        return {
            service: this
        }
    }

    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.modelContext())
    }
}
