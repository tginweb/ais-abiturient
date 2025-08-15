import {Injectable} from '@nestjs/common'
import {EduAisService} from "~modules/edu-ais/edu-ais.service"
import {EduAdmissionService} from "../../admission/core/service"
import {EduDirectionService} from "../../direction/core/service"
import {EduSSAppService as ModelCoreService} from "./../core/service"
import {EduSSAppModel as Model} from '../core/model';
import {EntityService} from "~modules/entity/entity.service";
import {EduAdminService} from "~modules/edu-org/admin/service";
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduSSEntrantService} from "~modules/edu-org/modules/ss-entrant/core/service";
import {EduInstituteService} from "~modules/edu-org/modules/institute/core/service";
import {EduSourceService} from "~modules/edu-org/modules/source/core/service";
import {EduAisEntrantService} from "~modules/edu-org/modules/ais-entrant";
import {EduFobService} from "~modules/edu-org/modules/fob/core/service";
import {appStatusList, appStatusListById} from "~modules/edu-org/modules/abit/core/app/enum";

const XLSX = require('xlsx')
const path = require('path')
const dayjs = require('dayjs')


@Injectable()
export class EduSSAppAdminService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly aisService: EduAisService,
        private readonly admissionService: EduAdmissionService,
        private readonly directionService: EduDirectionService,
        private readonly entityService: EntityService,
        private readonly eduAdminService: EduAdminService,
        private readonly eduSSEntrantService: EduSSEntrantService,
        private readonly eduAdmissionService: EduAdmissionService,
        private readonly eduInstituteService: EduInstituteService,
        private readonly eduFobService: EduFobService,
        private readonly eduSourceService: EduSourceService,
        private readonly eduAisEntrantService: EduAisEntrantService
    ) {
        this.entityService.entityTypeAddContext('edu_ss_app', this.eduAdminService.getContext())
    }

    excelDateToJSDate(excelDate) {
        const isDate = date => Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime())

        const SECONDS_IN_DAY = 24 * 60 * 60;
        const MISSING_LEAP_YEAR_DAY = SECONDS_IN_DAY * 1000;
        const MAGIC_NUMBER_OF_DAYS = (25567 + 2);

        if (!Number(excelDate)) {
            return null
        }

        const delta = excelDate - MAGIC_NUMBER_OF_DAYS;
        const parsed = delta * MISSING_LEAP_YEAR_DAY;
        const date = new Date(parsed)

        if (!isDate(date)) {
            return null
        }

        return date
    }


    async getFiltersTree(): Promise<any> {

        const schema = [
            {
                type: 'group',
                label: 'Объект',
                path: 'admission',
                children: [
                    {
                        type: 'number',
                        path: 'id',
                        label: 'ID',
                        op: 'eq'
                    },
                    {
                        type: 'number',
                        path: 'epguId',
                        label: 'ЕПГУ ID',
                        op: 'eq'
                    },
                    {
                        type: 'string',
                        path: 'snils',
                        label: 'СНИЛС',
                        op: 'like'
                    },
                ],
            },
            {
                label: 'Источник',
                type: 'string',
                path: 'createSource',
                control: 'options',
                multitple: true,
                op: 'in',
                options: [
                    {value: 'epgu', label: 'ЕПГУ'},
                    {value: 'ais', label: 'АИС'},
                ]
            },
            {
                label: 'Статус',
                type: 'number',
                path: 'statusId',
                control: 'options',
                multitple: true,
                op: 'in',
                options: appStatusList.map(item => ({
                    label: item.title,
                    value: item.id
                }))
            },
            {
                label: 'Финансирование',
                type: 'number',
                path: 'csource',
                control: 'options',
                multitple: true,
                op: 'in',
                options: [
                    {value: 1, label: 'Бюджет, на общих основаниях'},
                    {value: 2, label: 'Бюджет, по квоте особого права'},
                    {value: 3, label: 'Коммерческий прием'},
                    {value: 4, label: 'Целевой прием'},
                    {value: 5, label: 'Специальная квота'},
                ]
            },
        ]

        return schema
    }

    async entityAction(action, entity: Model, params = {}) {
        this.entityService.entityAddContext(entity)
        return this['entityAction_' + action](entity)
    }


}
