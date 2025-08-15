import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitAppGroupModel as Model} from "./model";
import {EntityService} from "~modules/entity/entity.service";
import {AbitAppGroupQuery as ModelQuery} from "./query";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order/service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {EduSourceService} from "~modules/edu-org/modules/source/core/service";
import {EduFobService} from "~modules/edu-org/modules/fob/core/service";
import {AbitAppGroupModelContext} from "./model-context";
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app/service";


@Injectable()
export class AbitAppGroupService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,

        @Inject(forwardRef(() => AbitOrderService))
        public abitOrderService: AbitOrderService,

        @Inject(forwardRef(() => AbitAppService))
        public abitAppService: AbitAppService,

        public eduAdmissionService: EduAdmissionService,
        public eduSourceService: EduSourceService,
        public eduFobService: EduFobService
    ) {
        this.entityService.registerEntityType('edu_app_group', {
            label: '',
            service: this,
        })
    }

    createModel(data: object): Model {
        return new this.model(data)
    }

    deleteModel(model: Model) {
        return model.deletePromise()
    }

    modelContext(): AbitAppGroupModelContext {
        return {
            service: this
        }
    }

    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.modelContext())
    }
}
