import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitTestModel as Model} from "./model";
import {EntityService} from "~modules/entity/entity.service";
import {AbitTestQuery as ModelQuery} from "./query";
import {AbitOrderService, TOrderPassport} from "~modules/edu-org/modules/abit/core/order/service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {EduSourceService} from "~modules/edu-org/modules/source/core/service";
import {EduFobService} from "~modules/edu-org/modules/fob/core/service";
import {AbitTestModelContext} from "./model-context";
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app/service";
import {EduSubjectService} from "~modules/edu-org/modules/subject/core/service";
import {EduEgeModel} from "~modules/edu-org/modules/ege/core/model";
import {AbitTestPassingTypeEnum} from "~modules/edu-org/modules/abit/core/test/enum";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {EduDocModel} from "~modules/edu-org/modules/doc/core/model";


@Injectable()
export class AbitTestService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,
        @Inject(forwardRef(() => AbitOrderService))
        public abitOrderService: AbitOrderService,
        @Inject(forwardRef(() => AbitAppService))
        public abitAppService: AbitAppService,
        public eduAdmissionService: EduAdmissionService,
        public eduSourceService: EduSourceService,
        public eduFobService: EduFobService,
        public eduSubjectService: EduSubjectService
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

    }

    modelContext(): AbitTestModelContext {
        return {
            service: this
        }
    }

    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.modelContext())
    }

    async onChangeDocs(order: AbitOrderModel, docs: EduDocModel[] = null) {

        docs = docs || await order.getDocs()

        /*
        const roles = docs.reduce((map,doc) =>{
            if (!map[doc.type]) {
                map[doc.type] = []
            }

            map[doc.type]

            return map
        }, {})

        for (const doc of docs) {

            doc.type
        }

        if (order.type === EduDocRoleEnum.PASSPORT) {

            const docs = await order.getDocs()
        }
         */
    }

    async ensureEgeForOrder(ege: EduEgeModel, orderPassport: TOrderPassport) {


        let test = await this.query().where({
            $and: [
                {
                    csubject: ege.csubject,
                    orderId: orderPassport.orderId
                },
                {
                    $or: [
                        {abitPassingType: AbitTestPassingTypeEnum.EGE},
                        {passingType: AbitTestPassingTypeEnum.EGE}
                    ]
                }
            ]
        }).execOne()

        if (!test) {
            test = this.createModel({})
            test.abitPassingType = AbitTestPassingTypeEnum.EGE
            test.passingType = AbitTestPassingTypeEnum.EGE
            test.csubject = ege.csubject
            test.orderId = orderPassport.orderId
            test.orderNid = orderPassport.orderNid
            test.fio = ege.fio
            test.snils = ''
            test.isEge = true
        }

        test.resultType = 'ege'

        if (!test.resultBall || (test.resultBall < ege.mark))  {
            test.resultBall = ege.mark
            test.resultDate = ege.date
        }

        test.resultVerified = true

        await test.savePromise()
    }
}
