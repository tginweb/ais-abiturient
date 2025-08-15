import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduSSEntrantModel as Model} from "./model";
import {EduSSEntrantQuery as ModelQuery} from "./query";
import {EntityService} from "~modules/entity/entity.service";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order/service";

@Injectable()
export class EduSSEntrantService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,

        @Inject(forwardRef(() => AbitOrderService))
        public readonly orderService: AbitOrderService,
    ) {
        this.entityService.registerEntityType('edu_ss_entrant', {
            label: 'EduSSEntrant',
            find: this.find.bind(this),
            findOne: this.findOne.bind(this),
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

    query() {
        return new ModelQuery(this.model.find())
    }

    createModel<T>(data: any): Model {
        return new this.model(data)
    }

    excelDateToJSDate(excelDate) {
        const isDate = date => Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime())

        const SECONDS_IN_DAY = 24 * 60 * 60;
        const MISSING_LEAP_YEAR_DAY = SECONDS_IN_DAY * 1000;
        const MAGIC_NUMBER_OF_DAYS = (25567 + 2);

        if (!Number(excelDate)) {
            throw new Error('wrong input format')
        }

        const delta = excelDate - MAGIC_NUMBER_OF_DAYS;
        const parsed = delta * MISSING_LEAP_YEAR_DAY;
        const date = new Date(parsed)

        if (!isDate(date)) {
            throw new Error('wrong excel date input')
        }

        return date
    }

    async ensureServiceEntrant(serviceEntrant: any): Promise<Model> {

        const snils = serviceEntrant.Snils

        //if (!snils) return ;

        let entrant: Model

        entrant = await this.query().where({
            guid: serviceEntrant.Guid
        }).execOne()


        if (!entrant) {
            entrant = this.createModel({
                firstName: serviceEntrant.Name,
                lastName: serviceEntrant.Surname,
                secondName: serviceEntrant.Patronymic,
            })
        }

        let orders

        if (snils) {
            orders = await this.orderService.query().where({
                'anket.personal.snils': snils,
                'eduType': 2
            }).execMany()
        } else {

            orders = await this.orderService.query().where({
                'epgu.guid': serviceEntrant.Guid,
                'eduType': 2
            }).execMany()

            if (!orders.length && false) {
                orders = await this.orderService.query().where({
                    'anket.personal.lastName': entrant.lastName,
                    'anket.personal.firstName': entrant.firstName,
                    'anket.personal.secondName': entrant.secondName,
                    'epgu.guid': {$exists: false},
                    'eduType': 2
                }).execMany()
            }
        }

        entrant.orderId = orders.map(item => item.id)
        entrant.orderNid = orders.map(item => item.nid)

        entrant.fio = [
            entrant.lastName,
            entrant.firstName,
            entrant.secondName,
        ].join(' ')

        entrant.snils = snils
        entrant.genderId = serviceEntrant.IdGender
        entrant.fields = serviceEntrant

        entrant.dateRegister = new Date()
        entrant.guid = serviceEntrant.Guid

        await entrant.savePromise()

        return entrant
    }
}
