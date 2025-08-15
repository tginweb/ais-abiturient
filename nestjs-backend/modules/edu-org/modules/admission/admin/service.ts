import {Injectable} from '@nestjs/common'
import {InjectModel} from "nestjs-typegoose"
import {ReturnModelType} from "@typegoose/typegoose"
import {EduAdmissionModel as Model} from "../core/model"
import {EduAdmissionService as ModelCoreService} from "../core/service"
import {EduAisService} from "~modules/edu-ais/edu-ais.service"
import {EduLevelService} from "~modules/edu-org/modules/level/core/service"
import {EduFobService} from "~modules/edu-org/modules/fob/core/service"
import {EduCampaignService} from "~modules/edu-org/modules/campaign/core/service"
import {EduAdminService} from "~modules/edu-org/admin/service"
import {EntityService} from "~modules/entity/entity.service"
import {EduCompetitionService} from "~modules/edu-org/modules/competition/core";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app";
import {EduDecreeService} from "~modules/edu-org/modules/decree/core";
import {EduInstituteService} from "~modules/edu-org/modules/institute/core";
const dayjs = require('dayjs')

@Injectable()
export class EduAdmissionAdminService {

    constructor(
        @InjectModel(Model) public readonly eduAdmissionModel: ReturnModelType<typeof Model>,
        private readonly modelCoreService: ModelCoreService,
        private readonly aisService: EduAisService,
        private readonly serviceEduLevel: EduLevelService,
        private readonly serviceEduFob: EduFobService,
        private readonly serviceEduCampaign: EduCampaignService,
        private readonly entityService: EntityService,
        private readonly eduAdminService: EduAdminService,
        private readonly competitionService: EduCompetitionService,
        private readonly appService: AbitAppService,
        protected readonly eduInstituteService: EduInstituteService,

    ) {
        this.entityService.entityTypeAddContext('edu_admission', this.eduAdminService.getContext())
    }

    async getFiltersTree(): Promise<any> {

        const eduLevels = await this.serviceEduLevel.find()
        const eduCampaigns = await this.serviceEduCampaign.find()
        const eduFobs = await this.serviceEduFob.find()
        const eduInstitute = await this.eduInstituteService.find()

        const schema = [
            {
                type: 'boolean',
                path: 'haveDopnabor',
                label: 'Есть допнабор',
                op: 'eq',
            },
            {
                type: 'boolean',
                path: 'epgu',
                label: 'Епгу',
            },

            {
                type: 'group',
                label: 'Набор',
                path: 'admission',
                children: [
                    {
                        type: 'number',
                        path: 'id',
                        label: 'ID',
                        op: 'eq'
                    },
                    {
                        type: 'string',
                        path: 'direct_name',
                        label: 'Направление',
                        op: 'like'
                    },
                    {
                        type: 'string',
                        path: 'name',
                        label: 'Наименование',
                        op: 'like'
                    },
                ]
            },
            {
                type: 'boolean',
                label: 'Выгрузка в EPGU',
                path: 'epguExport',
                op: 'eq',
            },
            {
                type: 'group',
                label: 'КЦП',
                path: 'volumeGroup',
                children: [
                    {
                        type: 'boolean',
                        path: 'haveVolume',
                        label: 'Есть места',
                    },
                    {
                        type: 'boolean',
                        path: 'haveBudgetVolume',
                        label: 'Есть бюджетные места',
                    },

                ]
            },
            {
                type: 'group',
                path: 'level',
                label: 'Уровень',
                children: [
                    {
                        type: 'number',
                        path: 'clevel',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: eduLevels.map((item) => ({
                            value: item.id,
                            label: item.name_ak
                        }))
                    },
                ]
            },
            {
                type: 'group',
                path: 'fob',
                label: 'Форма',
                children: [
                    {
                        type: 'number',
                        path: 'cfob',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: eduFobs.map((item) => ({
                            value: item.id,
                            label: item.name
                        }))
                    },
                ]
            },
            {
                type: 'group',
                path: 'direction',
                label: 'Направление',
                children: [
                    {
                        type: 'number',
                        path: 'cdirection',
                        control: 'number',
                        op: 'eq',
                        label: 'ID',
                    },
                    {
                        type: 'string',
                        path: 'directionOkso',
                        label: 'ОКСО',
                    },
                ]
            },
            {
                type: 'group',
                path: 'subjectGroup',
                label: 'Предметы',
                children: [
                    {
                        type: 'boolean',
                        label: 'Есть опциональные',
                        path: 'subjectsHaveOptional',
                        op: 'eq',
                    },
                    {
                        type: 'boolean',
                        label: 'Есть дет квота',
                        path: 'haveDetailTarget',
                        op: 'eq',
                    },
                ]
            },
            {
                type: 'group',
                path: 'campaign',
                label: 'Кампания',
                children: [
                    {
                        type: 'number',
                        path: 'ccampaign',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: eduCampaigns.map((item) => ({
                            value: item.id,
                            label: item.name
                        }))
                    },
                ]
            },
            {
                type: 'group',
                path: 'yearGroup',
                label: 'Год',
                children: [
                    {
                        type: 'number',
                        path: 'yr',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: [
                            {value: 2020, label: '2020'},
                            {value: 2021, label: '2021'},
                            {value: 2022, label: '2022'},
                            {value: 2023, label: '2023'},
                        ]
                    },
                ]
            },
            {
                label: 'Дело на факультете',
                type: 'string',
                path: 'cfac',
                control: 'select',
                useChips: true,
                multiple: true,
                op: 'in',
                options: eduInstitute.filter(item => item.meta.realfac === 't').map((item) => ({
                    value: item.id,
                    label: item.name
                }))
            },
        ]

        return schema
    }

    async syncWithAis<T>(): Promise<any> {


        const rep = this.aisService.getRepository()

        let aisAdmissions = await rep.selectAllFrom('abit_catadmission')

        /*
        aisAdmissions = aisAdmissions.filter(item => [
            23505, //
        ].indexOf(item.id) > -1)
         */

        const aisSubject2admission = await rep.selectAllFrom('subject2admission')

        const aisSubjectsByAdmission = aisSubject2admission.reduce((map, item) => {
            if (!map[item.cadmission]) map[item.cadmission] = []
            map[item.cadmission].push(item)
            return map
        }, {})


        for (let i = 0; i < aisAdmissions.length; i++) {

            const ais_admission = aisAdmissions[i]

            //if (ais_admission.id != 24161) continue;
            //if (ais_admission.cadmkind !== '5') continue;

            if (!ais_admission.id)
                continue;

            const local_admission = await this.modelCoreService.findOne({'id': ais_admission.id})

            let admission

            if (local_admission && ais_admission.dateend) {
                let [dateendDay, dateendMonth, dateentYear] = ais_admission.dateend.split(' ')[0].split('.')
                if (dateendDay.length === 1) dateendDay = '0' + dateendDay
                if (dateendMonth.length === 1) dateendMonth = '0' + dateendMonth
                local_admission.dateend = dayjs([dateentYear,dateendMonth,dateendDay].join('-'), 'YYYY-MM-DD').toDate()
                await local_admission.savePromise()
            }

            continue;

            if (!local_admission) {
                admission = this.modelCoreService.createModel({})
                admission.id = ais_admission.id
            } else {
                admission = local_admission
            }

            admission.clevel = ais_admission.cadmkind
            admission.ccampaign = ais_admission.cabitconst

            admission.cfac = ais_admission.cfac
            admission.ckaf = ais_admission.ckaf
            admission.cspec = ais_admission.cspec
            admission.cfob = ais_admission.cfob
            admission.cpodkind = ais_admission.cpodkind
            admission.accelerated = ais_admission.accelerated
            admission.yr = ais_admission.yr
            admission.abbr = ais_admission.abbr
            admission.spec_name = ais_admission.spec_name
            admission.kvalif_name = ais_admission.kvalif_name
            admission.direct_name = ais_admission.direct_name
            admission.name = ais_admission.name
            admission.celsum = ais_admission.celsum
            admission.comsumf = ais_admission.comsumf
            admission.comsumu = ais_admission.comsumu
            admission.isegeadmis = ais_admission.isegeadmis
            admission.cmagdirect = ais_admission.cmagdirect

            admission.cabitspecgroup = ais_admission.cabitspecgroup
            admission.mag = ais_admission.mag

            admission.inostr = ais_admission.inostr
            admission.active = ais_admission.active

            admission.cpnr = ais_admission.cpnr
            admission.cdirection2years = ais_admission.cdirection2years
            admission.cprofili = ais_admission.cprofili
            admission.cendkaf = ais_admission.cendkaf
            admission.index_adm = ais_admission.index_adm
            admission.dateend = ais_admission.dateend
            admission.coldfac = ais_admission.coldfac
            admission.prbak = ais_admission.prbak
            admission.group_osn = ais_admission.group_osn
            admission.group_lgot = ais_admission.group_lgot
            admission.ccatspo = ais_admission.ccatspo
            admission.cdekanat = ais_admission.cdekanat

            admission.budgCount = ais_admission.budgCount
            admission.budgPlaces = ais_admission.budgCount - ais_admission.lgotQuota - ais_admission.celevQuota - ais_admission.specQuota

            if (!admission.budgPlaces)
                admission.budgPlaces = 0;

            admission.lgotQuota = ais_admission.lgotQuota
            admission.celevQuota = ais_admission.celevQuota
            admission.comercCount = ais_admission.comercCount
            admission.oboronQuota = ais_admission.oboronQuota
            admission.specQuota = ais_admission.specQuota

            admission.abitpref = ais_admission.abitpref

            let cdirection

            switch (ais_admission.abbr) {
                case 'аТМД':
                    //01.06.01 Математика и механика
                    cdirection = 812833;
                    break;
                case 'аПМФ':
                case 'аТФЗ':
                    //03.06.01 Физика и астрономия
                    cdirection = 812834;
                    break;
                case 'аЭКЛ':
                case 'аГК':
                case 'аГФЗ':
                case 'аГКЛ':
                    //05.06.01 Науки о Земле
                    cdirection = 812836;
                    break;
                case 'аТАРР':
                case 'аГНП':
                    //07.06.01 Архитектура
                    cdirection = 812838;
                    break;
                case 'аТПС':
                case 'аВДС':
                case 'аСТМ':
                case 'аТОС':
                case 'аСМХ':
                    //08.06.01 Техника и технологии строительства
                    cdirection = 812839;
                    break;
                case 'аММП':
                case 'аАУП':
                    //09.06.01 Информатика и вычислительная техника
                    cdirection = 812840;
                    break;
                case 'аРТХ':
                    //11.06.01 Электроника, радиотехника и системы связи
                    cdirection = 812841;
                    break;
                case 'аЭКС':
                case 'аЭЭН':
                case 'аЭНК':
                    //13.06.01 Электро- и теплотехника
                    cdirection = 812842;
                    break;
                case 'аДВЛ':
                    //14.06.01 Ядерная, тепловая и возобновляемая энергетика и сопутствующие технологии
                    cdirection = 812843;
                    break;
                case 'аТМН':
                case 'аНС':
                    //15.06.01 Машиностроение
                    cdirection = 812844;
                    break;
                case 'аТХВ':
                case 'аТПСК':
                case 'аХТВ':
                    //18.06.01 Химическая технология
                    cdirection = 812845;
                    break;
                case 'аБПП':
                    //19.06.01 Промышленная экология и биотехнологии
                    cdirection = 812862;
                    break;
                case 'аОТН':
                    //20.06.01 Техносферная безопасность
                    cdirection = 812847;
                    break;
                case 'аТТГР':
                case 'аГГМ':
                case 'аОБП':
                    //21.06.01 Геология, разведка и разработка полезных ископаемых
                    cdirection = 812848;
                    break;
                case 'аМЕТ':
                case 'аМВ':
                    //22.06.01 Технологии материалов
                    cdirection = 812849;
                    break;
                case 'аЭТР':
                    //23.06.01 Техника и технологии наземного транспорта
                    cdirection = 812850;
                    break;
                case 'аУПП':
                    //27.06.01 Управление в технических системах
                    cdirection = 812852;
                    break;
                case 'аРЭ':
                case 'аМН':
                    //38.06.01 Экономика
                    cdirection = 812854;
                    break;
                case 'аССП':
                    //39.06.01 Социологические науки
                    cdirection = 812855;
                    break;
                case 'аППН':
                    //40.06.01 Юриспруденция
                    cdirection = 812856;
                    break;
                case 'аИСНТ':
                    //46.06.01 Исторические науки и археология
                    cdirection = 812858;
                    break;
                case 'аФКП':
                    //49.06.01 Физическая культура и спорт
                    cdirection = 812859;
                    break;
                default:
                    cdirection = ais_admission.cdirection
            }

            admission.cdirection = cdirection
            admission.cdirectionOriginal = ais_admission.cdirection

            admission.subjects = []

            if (aisSubjectsByAdmission[admission.id]) {
                admission.subjects = aisSubjectsByAdmission[admission.id]
            }

            admission.save()
        }
    }

    async fillEntity(entity: Model) {
        this.entityService.entityAddContext(entity)
        await entity.fill()
        //await entity.savePromise()
        return true
    }

    async fillEntityGosline(entity: Model) {
        this.entityService.entityAddContext(entity)
        await entity.fillGosline()
        //await entity.savePromise()
        return true
    }

    async entityEpguExchange(entity, op, path, ids) {

    }

    async recalcPlaces(ids: number[]) {

        const query = this.modelCoreService.query()

        if (ids && ids.length) {
            query.where({id: {$in: ids}})
        }

        //query.where({abbr: 'ИРТм'})

        const admissions = await query.execMany()


        for (const adm of admissions) {

            const compets = await this.competitionService.query().where({cadmission: adm.id}).execMany()

            if (true) {

                /*
                const budgetUsedNumber = await this.appService.query().where({
                    statusId: AppStatusEnum.INORDER,
                    cadmission: adm.id,
                    csource: {$nin: [3, 6]}
                }).countDocuments()
                 */

                //const budgetCompets = compets.filter(compet => compet.isBudget)

                const budgetCompets = compets

                for (const compet of budgetCompets) {
                    compet.usedNumber = await this.appService.query().where({
                        competitionId: compet.id,
                        statusId: AppStatusEnum.INORDER
                    }).countDocuments()
                    compet.admissionNumber = compet.usedNumber
                    await compet.savePromise()
                }

            }

        }
    }


}
