import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduSSEntrantModel as Model} from "./model";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduSSEntrantQuery as ModelQuery} from "./query";
import {EntityService} from "~modules/entity/entity.service";
import {EduSSAppModel} from "~modules/edu-org/modules/ss-app/core";
import {EduSSAppService} from "~modules/edu-org/modules/ss-app/core/service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {AbitOrderAdminService} from "~modules/edu-org/modules/abit/admin/order/service";
import {EduAisEntrantModel} from "~modules/edu-org/modules/ais-entrant";

@Injectable()
export class EduSSEntrantService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,
        private readonly aisService: EduAisService,
        private readonly eduSSAppService: EduSSAppService,
        private readonly eduAdmissionService: EduAdmissionService,
        private readonly abitOrderAdminService: AbitOrderAdminService,
    ) {
        this.entityService.registerEntityType('edu_ss_entrant', {
            label: 'EduSSEntrant',
            find: this.find.bind(this),
            findOne: this.findOne.bind(this)
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

    async aisGenerateIni(id): Promise<String | Boolean> {

        const entrant: any = await this.findOne({id: id})

        if (!entrant)
            return false;

        entrant.fields = JSON.parse(entrant.fieldsJson)

        const apps = await this.eduSSAppService.find({snils: entrant.snils})

        const fields: any = {};

        fields.result = 'success'
        fields.id = id
        fields.date_generation = '2022-07-07'
        fields.application_type_name = 'Бакалавриат и специалитет';

        fields.application_status_name = 'Ожидает рассмотрения'
        fields.application_status = 'sended'

        fields.medins = entrant.snils

        const [lname, fname, mname] = entrant.fields['ФИО'].split(' ')

        fields.lname = lname
        fields.fname = fname
        fields.mname = mname

        fields.csex = 1
        fields.birthday = entrant.fields['Дата рождения'].split('T')[0]
        fields.birthplace = entrant.fields['Место рождения']
        fields.citizenship = 'Российская федерация'

        //this.excelDateToJSDate()

        //{"ФИО":"АБРАМОВ АНДРЕЙ ВЛАДИМИРОВИЧ","Пол":1,"Дата рождения":"2004-05-18T06:00:00.000Z","Место рождения":"ЧИТИНСКАЯ ОБЛАСТЬ, ШИЛКА","Телефон":"+7(914)4996582","Почта":"abram905atlantxbo@gmail.com","ОКСМ код":"643","Снилс":"15912721063","Guid":"90f1ac54-b19f-43a0-87a7-6e714e01380b","Uid заявления":"","Uid ЕПГУ":2009366942,"Уровень":"Бакалавриат","Форма":"Очная форма обучения","Дата изменения":"","Оригинал документа об образовании":false,"Дата согласия на зачисление":"","Отзыв согласия на зачисление":"","Общежитие":true,"Удостоверяющий документ":1,"Серия":"7617","Номер":"987944","Кем выдан":"МИГРАЦИОННЫЙ ПУНКТ ОМВД РОССИИ ПО ШИЛКИНСКОМУ РАЙОНУ","Дата выдачи":43257,"Код подразделения":"750036","":""}

        //fields.doctype_name = termPersonDocType.name

        fields.doctype_name = 'Паспорт гражданина РФ'
        fields.passport_ser = entrant.fields['Серия']
        fields.passport_num = entrant.fields['Номер']
        fields.passport_date = entrant.fields['Дата выдачи'].split('T')[0]
        fields.passport_place = entrant.fields['Кем выдан']
        fields.passport_podr = entrant.fields['Код подразделения']
        fields.email = entrant.fields['Почта']
        fields.phone = entrant.fields['Телефон']
        fields.obsh = entrant.fields['Общежитие'] === 'true'

        const appsRes = []

        apps.forEach((app) => {
            if (apps.length <= 5) {
                appsRes.push(app)
            }
        })


        for (let index = 0; index < appsRes.length; index++) {

            const item = appsRes[index]

            const admission = await this.eduAdmissionService.findOne({id: item.cadmission})

            if (!admission)
                continue;

            fields['cadmission_' + index + '_id'] = item.cadmission
            fields['cadmission_' + index + '_name'] = admission.name

            let cset, cset_name, cpriemcat, cpriemcat_name

            switch (item.csource) {
                case 1:
                    cset = 1 // бюджет
                    cset_name = 'бюджет'
                    cpriemcat = 1
                    cpriemcat_name = 'На общих основаниях'
                    break;
                case 2:
                    cset = 1 // квота
                    cset_name = 'бюджет'
                    cpriemcat = 2
                    cpriemcat_name = 'Имеющие особое право'
                    break;
                case 3:
                    cset = 3 // коммерческий
                    cset_name = 'коммерческий'
                    cpriemcat = 1
                    cpriemcat_name = 'На общих основаниях'
                    break;
                case 4:
                    cset = 2 // целевой
                    cset_name = 'целевой'
                    cpriemcat = 1
                    cpriemcat_name = 'На общих основаниях'
                    break;
            }

            fields['cadmission_' + index + '_cset_id'] = cset
            fields['cadmission_' + index + '_cset_name'] = cset_name

            fields['cadmission_' + index + '_cabitpriemcat_id'] = cpriemcat
            fields['cadmission_' + index + '_cabitpriemcat_name'] = cpriemcat_name
        }

        return `[General]\n` + Object.keys(fields).map((key) => {
            return key + '=' + fields[key]
        }).join(`\n`)
    }

    async ensureEntrantByApp(app: EduSSAppModel, egeRes): Promise<Model> {

        let entrant: Model = await this.model.findOne({
            snils: app.snils
        }).exec()

        const lkOrder = null //await this.abitOrderAdminService.query().where({'anket.personal.snils': app.snils}).execOne()
        const aisOrder: EduAisEntrantModel = null // await this.entityService.findOne('edu_ais_entrant', {'snils': app.snils})

        let orderStatus
        let orderOperator

        if (aisOrder) {

            aisOrder.onEpgu = null
            aisOrder.epgu.onEpgu = true

            await aisOrder.savePromise()

            switch (aisOrder.state) {
                case 19: // не поступил
                case 20: // забрал
                    orderStatus = 'canceled'
                    break;
                default:
                    orderStatus = 'accepted'
            }
        } else if (lkOrder) {
            orderStatus = lkOrder.state.status
        }

        if (lkOrder) {
            orderOperator = lkOrder.coperator
        }

        let haveExams = false

        if ([23722, 23732, 23738, 23866, 23690, 23858, 23731, 23734].indexOf(app.cadmission)>-1) {
            haveExams = true
        }

        if (!entrant) {

            if (!orderStatus)
                orderStatus = 'sended'

            entrant = new this.model({
                fio: app.fio,
                snils: app.snils,
                egeRes: egeRes,
                fieldsJson: app.fieldsJson,
                dateRegister: app.dateRegister,
                changed: true,
                haveExams: haveExams,
                status: orderStatus,
                coperator: orderOperator,
                createSource: app.createdByEpgu ? 'epgu' : 'other'
            })

            await entrant.savePromise()

        } else {

            if (!orderStatus) {
                orderStatus = entrant.status
            }

            if (!orderStatus)
                orderStatus = 'sended'

            if (orderOperator && !entrant.coperator) {
                entrant.coperator = orderOperator
            }

            entrant.haveExams = haveExams
            entrant.fieldsJson = app.fieldsJson
            entrant.dateRegister = app.dateRegister
            entrant.status = orderStatus
            entrant.createSource = app.createdByEpgu ? 'epgu' : 'other'

            await entrant.savePromise()
        }

        return entrant
    }
}
