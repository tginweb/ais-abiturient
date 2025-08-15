import {Injectable} from '@nestjs/common'
import {EduAisService} from "~modules/edu-ais/edu-ais.service"
import {EduAdmissionService} from "../../admission/core/service"
import {EduDirectionService} from "../../direction/core/service"
import {EduSSEntrantService as ModelCoreService} from "./../core/service"
import {EduSSEntrantModel as Model} from '../core/model';
import {EntityService} from "~modules/entity/entity.service";
import {EduAdminService} from "~modules/edu-org/admin/service";
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitOrderStatusEnum, abitOrderStatusList} from "~modules/edu-org/modules/abit/core/order/statics/status";
import {EduSSAppService} from "~modules/edu-org/modules/ss-app/core/service";
import {EduAisEntrantService} from "~modules/edu-org/modules/ais-entrant/service";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
import {EduDocService} from "~modules/edu-org/modules/doc/core/service";
import {EduDocRoleEnum, EduDocStatusByEpguId} from "~modules/edu-org/modules/doc/core/enum";
import {formatEpguDate, formatEpguDatetime} from "~modules/edu-org/modules/epgu/core/util";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order";


@Injectable()
export class EduSSEntrantAdminService {

    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly aisService: EduAisService,
        private readonly admissionService: EduAdmissionService,
        private readonly directionService: EduDirectionService,
        private readonly entityService: EntityService,
        private readonly eduAdminService: EduAdminService,
        private readonly eduSSAppService: EduSSAppService,
        private readonly eduAisEntrantService: EduAisEntrantService,
        private readonly docService: EduDocService,
    ) {
        this.entityService.entityTypeAddContext('edu_ss_entrant', this.eduAdminService.getContext())
    }

    async importExcellFile(content): Promise<any> {


    }

    async getFiltersTree(): Promise<any> {

        const schema = [
            {
                type: 'boolean',
                label: 'Допнабор',
                path: 'isdop',
                op: 'eq',
            },
            {
                type: 'boolean',
                label: 'По направлениям из ЕПГУ есть внутренние испытания',
                path: 'haveExams',
                op: 'eq',
            },
            {
                type: 'boolean',
                label: 'Есть среди ордеров',
                path: 'orderExists',
                op: 'eq',
            },
            {
                type: 'boolean',
                label: 'Есть дубли в ордерах',
                path: 'orderDuplicates',
                op: 'eq',
            },
            {
                type: 'group',
                path: 'statusGroup',
                label: 'Статус',
                children: [
                    {
                        type: 'string',
                        path: 'status',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: abitOrderStatusList.map((item) => ({
                            value: item.code,
                            label: item.titleAdmin
                        }))
                    },
                ]
            },
            {
                type: 'group',
                label: 'Персона',
                path: 'entrant',
                children: [
                    {
                        type: 'number',
                        path: 'id',
                        label: 'ID',
                        op: 'eq'
                    },
                    {
                        type: 'string',
                        path: 'snils',
                        label: 'СНИЛС',
                        op: 'like'
                    },
                    {
                        type: 'string',
                        path: 'fio',
                        label: 'ФИО',
                        op: 'like'
                    },
                ]
            },

            {
                type: 'group',
                label: 'Достижения',
                path: 'achievements',
                children: [
                    {
                        control: 'checkbox',
                        path: 'achievementsExists',
                        label: 'Есть достижения',
                    },
                ]
            },

            {
                type: 'group',
                label: 'Согласие',
                path: 'agreement',
                children: [
                    {
                        control: 'checkbox',
                        path: 'haveEpguAgreement',
                        label: 'Есть согласие на ЕПГУ',
                    },
                    {
                        control: 'checkbox',
                        path: 'haveAisAgreement',
                        label: 'Есть согласие на АИС',
                    },
                ]
            },
        ]

        return schema
    }

    async entityAction(action, entity: Model, params = {}) {
        action = action || 'import'
        this.entityService.entityAddContext(entity)
        return this['entityAction_' + action](entity)
    }

    async entityAction_delete(entity: Model, params = {}) {
        return this.coreService.model.deleteOne({_id: entity._id})
    }

    async entityAction_import(entity: Model, params = {}) {

        let order: AbitOrderModel

        let res

        order = await this.coreService.orderService.query().where({'epgu.guid': entity.guid}).execOne()

        if (!order) {
            if (entity.snils) {
                 order = await this.coreService.orderService.query().where({
                    'anket.personal.snils': entity.snils,
                    'eduType': 2
                }).execOne()
            } else {
                const filter = {
                    'anket.personal.lastName': entity.lastName,
                    'anket.personal.firstName': entity.firstName,
                    'epgu.guid': {$exists: false},
                    'eduType': 2
                }
                if (entity.secondName) {
                    filter['anket.personal.secondName'] = entity.secondName
                }
                order = await this.coreService.orderService.query().where(filter).execOne()
            }
        }

        let isNew = false

        if (order) {
            //order.isdop = true
            //await order.savePromise()
            //return 'isdop'
        }

        //return 'ne';

        if (!order) {

            return 'no_create'

            res = 'create'

            isNew = true
            order = this.coreService.orderService.createModel({})
            order.cordersource = AbitWorkplaceEnum.EPGU
            order.anket.personal.snils = entity.snils
            order.anket.personal.inn = null
            order.eduType = 2
            await order.savePromise()
            order = await this.coreService.orderService.query().getById(order.id)
            order.state.status = AbitOrderStatusEnum.SENDED
            order.anket.personal.gender = entity.genderId === 1 ? 'male' : 'female'

            console.log(order.fio, 'create')

            order.updateEmptyFields({
                'anket.personal.citizenship': 'russia',
                'anket.personal.firstName': entity.firstName,
                'anket.personal.lastName': entity.lastName,
                'anket.personal.secondName': entity.secondName,
                'anket.personal.birthday': formatEpguDate(entity.fields['Birthday']),
                'anket.personal.birthplace': entity.fields['Birthplace'],
                'anket.personal.phone': entity.fields['Phone'],
                'anket.personal.email': entity.fields['Email'],
            })

            if (entity.fields['AddressList']) {

                const addresses = Array.isArray(entity.fields['AddressList']['Address']) ? entity.fields['AddressList']['Address'] : [entity.fields['AddressList']['Address']]

                for (const address of addresses) {
                    if (address.IsRegistration) {
                        if (!order.anket.personal.addressReg['name']) {
                            order.anket.personal.addressReg['name'] = address.FullAddr
                            order.anket.personal.addressReg['custom'] = true
                        }
                    } else {
                        if (!order.anket.personal.addressLive['name']) {
                            order.anket.personal.addressLive['name'] = address.FullAddr
                            order.anket.personal.addressLive['custom'] = true
                        }
                    }
                }

                if (!order.anket.personal.addressReg['name'] && order.anket.personal.addressLive['name']) {
                    order.anket.personal.addressReg = order.anket.personal.addressLive
                }

                if (!order.anket.personal.addressLive['name'] && order.anket.personal.addressReg['name']) {
                    order.anket.personal.addressLive = order.anket.personal.addressReg
                }
            }

            await order.savePromise()

            if (entity.fields['DocumentList']) {

                const docs = await order.getDocs()

                const epguDocs = Array.isArray(entity.fields['DocumentList']['Document']) ? entity.fields['DocumentList']['Document'] : [entity.fields['DocumentList']['Document']]

                for (const epguDoc of epguDocs) {

                    const cats = await this.docService.getInfoByTypeId(epguDoc.IdDocumentType)

                    const docCatId = cats.docCat.id

                    let prevEduLevel

                    let docRole: EduDocRoleEnum

                    switch (cats.rootDocCat.id) {
                        case 1:
                            docRole = EduDocRoleEnum.PASSPORT
                            break;
                        case 2:
                            docRole = EduDocRoleEnum.EDU
                            break;
                        case 4:
                        case 5:
                            docRole = EduDocRoleEnum.ACHIEVEMENT
                            break;
                        case 7:
                            docRole = EduDocRoleEnum.LGOT
                            break;
                        case 8:
                            docRole = EduDocRoleEnum.COMPATRIOT
                            break;
                        default:

                            if (cats.docCat.id === 15) {
                                docRole = EduDocRoleEnum.ACHIEVEMENT
                            } else {
                                docRole = EduDocRoleEnum.OTHER
                            }

                            break;
                    }


                    if (docRole === EduDocRoleEnum.EDU) {

                        switch (docCatId) {
                            case 13:
                                prevEduLevel = 7
                                break;
                            case 10:
                                switch (epguDoc.IdDocumentType) {
                                    case 210073: // bak
                                    case 210075:
                                        prevEduLevel = 2
                                        break;
                                    case 210061: // spec
                                    case 210076:
                                        prevEduLevel = 1
                                        break;
                                    case 210074: // mag
                                    case 210059:
                                        prevEduLevel = 3
                                        break;
                                    default:
                                        prevEduLevel = 2
                                }
                                break;
                            case 9:
                                prevEduLevel = 4
                        }

                        if (prevEduLevel && !order.anket.education.prevEduLevel) {
                            order.anket.education.prevEduLevel = prevEduLevel
                        }
                    }


                    let doc = docs.find(doc => (
                        (doc.epgu.guid === epguDoc.Guid) ||
                        (
                            epguDoc.DocNumber &&
                            (doc.docTypeId === epguDoc.IdDocumentType) &&
                            (doc.docNumber.trim().toString() === epguDoc.DocNumber.toString())
                        )
                    ))

                    if (!doc) {
                        doc = this.docService.createModel({})
                        doc.createSource = AbitWorkplaceEnum.EPGU
                        doc.orderId = order.id
                        doc.type = docRole
                        doc.docTypeId = epguDoc.IdDocumentType
                        doc.docCategoryId = docCatId
                        doc.docName = epguDoc.DocName
                        doc.docSeries = epguDoc.DocSeries
                        doc.docNumber = epguDoc.DocNumber
                        doc.docOrg = epguDoc.DocOrganization
                        doc.issueDate = formatEpguDatetime(epguDoc.IssueDate)
                        doc.statusId = EduDocStatusByEpguId[epguDoc['IdCheckStatus']].id
                    } else {
                        doc.docSeries = epguDoc.DocSeries
                        doc.issueDate = formatEpguDatetime(epguDoc.IssueDate)
                        doc.statusId = EduDocStatusByEpguId[epguDoc['IdCheckStatus']].id
                    }

                    doc.epgu.guid = epguDoc.Guid
                    doc.epgu.data = epguDoc

                    await doc.savePromise()

                }
            }

        } else {

            res = 'update'

            if (!order.epgu.guid) {
                order.epgu.guid = entity.guid
            }

            if (entity.lastName.trim().toLowerCase() !== order.anket.personal.lastName.trim().toLowerCase()) {
                console.log([entity.fio, order.fio, entity.snils], 'not match')
                //return 'not_match'
            }

            /*
            isNew = false
            switch (order.state.status) {
                case AbitOrderStatusEnum.DRAFT:
                case AbitOrderStatusEnum.CANDIDATE:
                    order.state.status = AbitOrderStatusEnum.SENDED
            }
             */
        }

        const epguApps = await this.eduSSAppService.query().where({guidEntrant: entity.guid}).execMany()

        for (const epguApp of epguApps) {
            if (epguApp.isDopnabor) {
                for (const epguAppCompetition of epguApp.apps) {
                    await this.coreService.orderService.updateAppFromEpgu(order, epguAppCompetition, epguApp)
                }
            }
        }

        await order.fetchAndUpdateFirstApp()

        if (!order.cinstitute) {
            order.cinstitute = order.cfacComputed
        }

        await order.savePromise()
        return res
    }
}
