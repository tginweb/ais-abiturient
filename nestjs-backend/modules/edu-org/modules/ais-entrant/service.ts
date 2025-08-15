//sss
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduAisEntrantModel as Model, EduAisEntrantModel} from "./model";
import {AisCompetitionGroup, DocSubject} from "./subdoc/all";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduAisEntrantQuery as ModelQuery} from "./query";
import {EntityService} from "~modules/entity/entity.service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order/service";
import {AbitOrderAdminService} from "~modules/edu-org/modules/abit/admin/order";
import {EduCompetitionService} from "~modules/edu-org/modules/competition/core/service";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
import {AbitTestService} from "~modules/edu-org/modules/abit/core/test/service";
import {aisEduTypeById, AisSchoolTypes} from "~modules/edu-org/enum/ais";
import {EduDocRoleEnum} from "~modules/edu-org/modules/doc/core/enum";
import {EduDocService} from "~modules/edu-org/modules/doc/core/service";
import {formatAisDate} from "~modules/edu-org/modules/ais-entrant/util";
import {aisCitizenTypeById, aisCitizenTypeEnum} from "~modules/edu-org/enum/ais-student-status";
import {EduEpguDictionaryService} from "~modules/edu-org/modules/epgu-dictionary/core/service";
import {EduCountryService} from "~modules/edu-org/modules/country/core/service";
import {EduCountryModel} from "~modules/edu-org/modules/country/core/model";
import {EduSubjectService} from "~modules/edu-org/modules/subject/core";
import {AbitTestPassingTypeEnum} from "~modules/edu-org/modules/abit/core/test/enum";
import {AbitOrderStatusEnum} from "~modules/edu-org/modules/abit/core/order/statics/status";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";


const dayjs = require('dayjs')

@Injectable()
export class EduAisEntrantService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,
        @Inject(forwardRef(() => EduAisService))
        private readonly aisService: EduAisService,
        @Inject(forwardRef(() => EduAdmissionService))
        private readonly eduAdmissionService: EduAdmissionService,
        @Inject(forwardRef(() => AbitOrderAdminService))
        private readonly orderAdminService: AbitOrderAdminService,
        @Inject(forwardRef(() => AbitOrderService))
        private readonly orderService: AbitOrderService,
        private competitionService: EduCompetitionService,
        protected readonly abitTestService: AbitTestService,
        private readonly docService: EduDocService,
        private readonly epguDictionaryService: EduEpguDictionaryService,
        private readonly eduCountryService: EduCountryService,
        private readonly subjectService: EduSubjectService,
    ) {
        this.entityService.registerEntityType('edu_ais_entrant', {
            label: 'EduAisEntrant',
            find: this.find.bind(this),
            findOne: this.findOne.bind(this),
            query: this.query.bind(this),
        })
    }

    query() {
        return (new ModelQuery(this.model.find()))
    }

    async find<T>(filter: any = null, nav: any = null, view = 'public'): Promise<Model[]> {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withViewPublic()
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

    async importCis(oldOrder) {

        console.log(oldOrder._id)

        const foundOrder = await this.orderService.query().where({
            _id: oldOrder._id.$oid
        }).execOne()

        if (foundOrder) {
            return true
        } else {

            console.log('create')
            const order = new this.orderService.model(oldOrder)
            await order.savePromise()

            console.log(order)

            //const order = this.orderService.createModel({})


        }

        return false
    }

    async importCisSetNid() {

        const foundOrders = await this.orderService.query().where({
            cisNew: {$exists: false}
        }).execMany()

        console.log(foundOrders.length)

        let nid = 10000
        for (const order of foundOrders) {
            nid++
            order.nid = nid
            await order.savePromise()
        }

        return false
    }

    async importEntrantFromAisJson(data) {

        const aisHistoryAdmissions = await this.eduAdmissionService.getAisHistoryAdmissionsById()

        const studId = parseInt(data.id)

        let entity: Model = await this.model.findOne({id: studId}).exec()

        //let entities: Model[] = await this.model.find().exec()

        if (!entity) {
            entity = new this.model({
                id: studId
            })
        }

        entity.isdop = !!data.isdop
        entity.cadmission = data.cadmission ? parseInt(data.cadmission) : null
        entity.cset = data.cset
        entity.cabitrecadm = data.cabitrecadm

        entity.data = data

        entity.data['ccontry'] = parseInt(data.ccontry)

        if (data.medins)
            entity.snils = data.medins.replace(/[^\d]/g, '')

        if (entity.snils.match('000000')) {
            entity.snils = ''
        }

        let orders: AbitOrderModel[] = await this.orderService.query().where({'ais.aisId': studId}).execMany()

        if (!orders.length) {
            if (entity.snils) {
                orders = await this.orderService.query().where({'anket.personal.snils': entity.snils}).execMany()
            } else if (entity.passportReal) {
                orders = await this.orderService.query().where({
                    'anket.personal.doc.serial': entity.passportSer,
                    'anket.personal.doc.number': entity.passportNum,
                }).execMany()
                orders = orders.filter((order) => {
                    return order.anket.personal.lastName.trim().toLowerCase() === data.lname.trim().toLowerCase()
                })
            }
        }

        for (const order of orders) {
            if (entity.isdop) {
                order.isdop = entity.isdop
                await order.savePromise()
            }
        }

        entity.orderNid = orders.map(order => order.nid)

        if (data.inn)
            entity.inn = data.inn.replace(/[^\d]/g, '')

        if (entity.inn.match('00000')) {
            entity.inn = ''
        }

        entity.state = parseInt(data.cstudstate)
        entity.appldate = data.appldate ? dayjs(data.appldate, 'YYYY-MM-DD HH:mm:ss.SSS').toDate() : null

        entity.citem = data.citem ? parseInt(data.citem) : 0
        entity.firstName = data.fname
        entity.lastName = data.lname
        entity.secondName = data.mname
        entity.phone = data.phone
        entity.email = data.email

        entity.passport_ser = data.passport_ser ? data.passport_ser.trim() : null
        entity.passport_num = data.passport_num ? data.passport_num.trim() : null


        entity.achievements = []

        const aisStatusInfo = entity.stateStatusInfo

        //const eduDoc = entity.docsEdu.find(doc => doc.uidLocal === entity.getDefaultEduDocLocalUid)
        //const identDoc = entity.docsIdent.find(doc => doc.uidLocal === entity.getDefaultEduDocLocalUid)

        if (!aisStatusInfo) {
            console.log([entity.id, entity.state], 'no status')
            return
        }

        if (data.apps) {

            entity.apps = []

            const aisApps = data.apps.map((aisApp => {
                aisApp.ord = parseInt(aisApp.ord)
                return aisApp
            })).sort((a, b) => ((a.ord > b.ord) ? 1 : -1))

            for (const aisApp of aisApps) {

                let appCadmission = parseInt(aisApp.cadmission)

                let admission: EduAdmissionModel = await this.eduAdmissionService.getByIdCached(appCadmission)

                if (!admission) {

                    const oldAdmission = aisHistoryAdmissions[appCadmission]

                    if (oldAdmission) {
                        admission = await this.eduAdmissionService.query().where({
                            abbr: oldAdmission.abbr,
                            //cadmkind: parseInt(oldAdmission.cadmkind),
                            //cdirection: parseInt(oldAdmission.cdirection),
                            //cfob: parseInt(oldAdmission.cfob),
                            //comercCount: {$gt: 0}
                        }).execOne()

                        if (admission) {
                            appCadmission = admission.id
                        } else {
                            console.log(appCadmission, '1')
                            return
                        }
                    } else {
                        console.log(appCadmission, '2')
                        return
                    }
                }

                if (!admission)
                    continue;

                entity.eduType = admission.orderTypeId

                aisApp.cset = parseInt(aisApp.cset)
                aisApp.cpriemcat = parseInt(aisApp.cpriemcat)
                aisApp.cadmission = appCadmission

                const cset = aisApp.cset
                const cpriemcat = aisApp.cpriemcat
                const cadmission = aisApp.cadmission

                let csource

                switch (cset) {
                    case 1:
                        if (cpriemcat === 1) {
                            csource = 1
                        } else if (cpriemcat === 4) {
                            csource = 5
                        } else {
                            csource = 2
                        }
                        break;
                    case 2:
                        csource = 4
                        break;
                    case 3:
                        csource = 3
                        break;
                    case 6:
                        csource = 6
                        break;
                }

                if (csource === 6) {
                    console.log(appCadmission, 'gos')
                    //continue;
                }

                aisApp.csource = csource

                const competition = await this.competitionService.query().where({
                    $and: [
                        {
                            cadmission: cadmission,
                            csource: csource,
                            isdop: {$ne: true}
                        },
                        {
                            $or: [
                                {celevOrg: {$exists: false}},
                                {celevOrg: null},
                            ]
                        }
                    ]
                }).execOne()


                if (!competition) {
                    console.log({
                        abbr: admission.abbr,
                        cadmission: cadmission,
                        csource: csource,
                    }, 'compet not found')
                    continue
                } else {
                    if (competition.celevOrg) {
                        throw new Error('celevOrg')
                    }
                }

                let app = entity.apps.find(app => app.competitionId === competition.id)

                let isNew = false

                if (!app) {
                    isNew = true
                    app = <AisCompetitionGroup>{
                        cadmission: cadmission,
                        csource: csource,
                        competitionId: competition.id,
                        competitionUid: competition.uid,
                    }
                    if (admission) {
                        entity.clevel = admission.clevel
                        app.cfob = admission.cfob
                    }
                }

                app.statusId = aisStatusInfo.appStatusId
                app.ord = parseInt(aisApp.ord)
                app.cpriemcat = parseInt(aisApp.cpriemcat)
                app.cset = parseInt(aisApp.cset)

                if (isNew)
                    entity.apps.push(app)
            }

            /*
            entity.apps.forEach((app) => {
                if (!aisApps.find(aisApp => aisApp.cadmission === app.cadmission && aisApp.csource === app.csource)) {
                    app.ord = 100 + app.ord
                    app.deleted = true
                    app.agreement = false
                } else {
                    app.deleted = false
                }
            })
             */

            //entity.reindexApps()
        }

        if (data.achievements) {
            for (const item of data.achievements) {
                item.id = parseInt(item.id)
                item.cstud = parseInt(item.cstud)
                item.cpriemachievement = parseInt(item.cpriemachievement)
                item.ball = parseInt(item.ball)
            }
            entity.achievements = data.achievements
        }

        if (data.subjects && data.subjects.length) {
            const items = []
            for (const aisItem of data.subjects) {
                const item = <DocSubject>{}
                item.csubject = parseInt(aisItem.csubject)
                item.mark = parseFloat(aisItem.mark)
                item.verified = aisItem.verified === 't'
                item.cresultSourceType = parseInt(aisItem.cresultSourceType)
                item.markdate = aisItem.markdate ? dayjs(aisItem.markdate, 'YYYY-MM-DD HH:mm:ss.SSS').toDate() : null
                items.push(item)
            }
            entity.subjects = items
        }
        await entity.savePromise()

        return true
    }

    async entityAction_zach(aisEntrant: EduAisEntrantModel) {

        const statusInfo = aisEntrant.stateStatusInfo

        //if (aisEntrant.state !== 1) return false

        let admission: EduAdmissionModel

        if (aisEntrant.cadmission) {
            admission = await this.eduAdmissionService.query().where({id: aisEntrant.cadmission}).execOne()
        }

        if (!admission) {

            const aisHistoryAdmissions = await this.eduAdmissionService.getAisHistoryAdmissionsById()
            const oldAdmission = aisHistoryAdmissions[aisEntrant.cadmission]

            if (oldAdmission) {
                admission = await this.eduAdmissionService.query().where({
                    abbr: oldAdmission.abbr,
                    //cadmkind: parseInt(oldAdmission.cadmkind),
                    //cdirection: parseInt(oldAdmission.cdirection),
                    //cfob: parseInt(oldAdmission.cfob),
                    //comercCount: {$gt: 0}
                }).execOne()
            } else {
                console.log('admission not found ' + aisEntrant.cadmission)
                return false
            }
        }


        if (admission.cfac === 17)
            return 'usol';

        const found = await this.orderAdminService.findEntrantOrderByData({
            eduType: admission.orderTypeId,
            aisId: aisEntrant.id,
            snils: aisEntrant.snilsReal,
            docSerial: aisEntrant.passportReal ? aisEntrant.passport_ser : null,
            docNumber: aisEntrant.passportReal ? aisEntrant.passport_num : null,
        })

        let order: AbitOrderModel

        if (found) {

            order = found.order

            if (order.ais.aisId) {

                if (order.ais.aisId !== aisEntrant.id) {

                    console.log([order.fio, order.ais.aisId, aisEntrant.id, aisEntrant.fio], 'NOT EQUAL aisId')

                    if (
                        order.anket.personal.lastName.toLowerCase() === aisEntrant.lastName.toLowerCase()
                        && order.anket.personal.firstName.toLowerCase() === aisEntrant.firstName.toLowerCase()
                    ) {

                    } else {
                        console.log([order.fio, order.ais.aisId, aisEntrant.id, aisEntrant.fio], 'NOT EQUAL FIO')

                        return;
                    }
                }
            } else {
                //console.log([order.nid, aisEntrant.id], 'NO aisId')
            }

        }

        if (order) {

            order.ais.aisId = aisEntrant.id
            await order.savePromise()

            const aisCadmission = aisEntrant.cabitrecadm ? aisEntrant.cabitrecadm : aisEntrant.cadmission

            if (!order.prezachCompetitionId) {

                const orderActiveApps = (await order.getAppsCollection()).getActiveItems()

                let foundAisApp: AisCompetitionGroup

                let isGosline = false

                if (aisEntrant.apps.length) {
                    for (const aisApp of aisEntrant.getAppsSorted()) {
                        if (aisApp.csource === 6) {
                            isGosline = true
                            break
                        }

                        if (aisApp.cadmission === aisCadmission) {
                            foundAisApp = aisApp
                            break;
                        }
                    }
                }

                if (isGosline) {
                    return 'gosline'
                }

                if (foundAisApp) {

                    const orderApp = orderActiveApps.findByCompetitionId(foundAisApp.competitionId)

                    if (orderApp) {

                        orderApp.statusId = AppStatusEnum.INORDER
                        await orderApp.savePromise()

                        order.zachCompetitionId = foundAisApp.competitionId
                        order.prezachCompetitionId = foundAisApp.competitionId
                        order.prezachStatus = 'accepted'

                        await order.savePromise()

                        //return 'zach'
                    } else {
                        console.log([aisEntrant.id, aisEntrant.fio, order.nid], 'order_app_not_found')
                        return 'order_app_not_found'
                    }

                } else {
                    console.log([aisEntrant.id, aisEntrant.fio], 'ais_app_not_found')
                    return 'ais_app_not_found'
                }

            } else {
                console.log([aisEntrant.id, aisEntrant.fio, order.nid], 'order_already_zach')
                //return 'order_already_zach'
            }

            if (!order.decreeNid) {
                console.log('OK')
                order.decreeNid = 8
                await order.savePromise()
            }

        } else {
            console.log([aisEntrant.id, aisEntrant.fio], 'order_not_found')
            return 'order_not_found'
        }


        return 'not_found'
    }


    async entityAction_import_force(aisEntrant: EduAisEntrantModel, create = true) {
        console.log('import_force')
        return await this.entityAction_import(aisEntrant, create, true)
    }

    async entityAction_import(aisEntrant: EduAisEntrantModel, create = true, override = false) {

        const statusInfo = aisEntrant.stateStatusInfo

        //if (statusInfo.cancel || !statusInfo.member) return false

        let admission

        if (aisEntrant.cadmission) {
            admission = await this.eduAdmissionService.query().where({id: aisEntrant.cadmission}).execOne()
        }

        if (!admission) {

            const aisHistoryAdmissions = await this.eduAdmissionService.getAisHistoryAdmissionsById()
            const oldAdmission = aisHistoryAdmissions[aisEntrant.cadmission]

            if (oldAdmission) {
                admission = await this.eduAdmissionService.query().where({
                    abbr: oldAdmission.abbr,
                    //cadmkind: parseInt(oldAdmission.cadmkind),
                    //cdirection: parseInt(oldAdmission.cdirection),
                    //cfob: parseInt(oldAdmission.cfob),
                    //comercCount: {$gt: 0}
                }).execOne()
            } else {
                console.log('admission not found ' + aisEntrant.cadmission)
                return false
            }
        }

        if (!admission)
            return ;

        const found = await this.orderAdminService.findEntrantOrderByData({
            eduType: admission.orderTypeId,
            aisId: aisEntrant.id,
            snils: aisEntrant.snilsReal,
            docSerial: aisEntrant.passportReal ? aisEntrant.passport_ser : null,
            docNumber: aisEntrant.passportReal ? aisEntrant.passport_num : null,
        })

        let order: AbitOrderModel

        if (found) {

            order = found.order

            if (order.ais.aisId) {

                if (order.ais.aisId !== aisEntrant.id) {

                    console.log([order.fio, order.ais.aisId, aisEntrant.id, aisEntrant.fio], 'NOT EQUAL aisId')

                    if (
                        order.anket.personal.lastName.toLowerCase() === aisEntrant.lastName.toLowerCase()
                        && order.anket.personal.firstName.toLowerCase() === aisEntrant.firstName.toLowerCase()
                    ) {

                    } else {
                        console.log([order.fio, order.ais.aisId, aisEntrant.id, aisEntrant.fio], 'NOT EQUAL FIO')

                        return;
                    }
                }
            } else {
                //console.log([order.nid, aisEntrant.id], 'NO aisId')
            }


            /*
                if (order.ais.aisId === aisEntrant.id) {
                    order.regnum = aisEntrant.data['regn'] ? parseInt(aisEntrant.data['regn']) : null
                    await order.savePromise()
                }
                return ;
             */

            //order = found.order

            //const aisRegnum = aisEntrant.data['regn'] ? parseInt(aisEntrant.data['regn']) : null
            //order.regnum = aisRegnum
            //await order.savePromise()
        }

        let orderNew = false


        if (!order) {

            //return 'skip_new'

            orderNew = true

            if (!create) {
                return false
            }

            if (!admission) {
                return
            }

            order = this.orderService.createModel({})
            order.eduType = admission.orderTypeId
            order.cordersource = AbitWorkplaceEnum.AIS
            order.anket.personal.snils = aisEntrant.snilsReal
            order.anket.personal.inn = aisEntrant.data['inn']
            order.anket.personal.doc.serial = aisEntrant.passport_ser
            order.anket.personal.doc.number = aisEntrant.passport_num
            order.podldoc = aisEntrant.data['docobrazpodl'] === 't' || aisEntrant.data['docobrazpodl'] === 'T'

            if (statusInfo.member) {
                order.setStatus({
                    status: 'accepted',
                })
            } else {
                order.setStatus({
                    status: 'draft',
                })
            }

            await order.savePromise()

            order = await this.orderService.query().getById(order.id)

        } else {

        }

        if (orderNew || override) {

            await this.orderService.ensureOrderInternalDocs(order)

            const edu: any = aisEntrant.data['edu']

            let aisEduType

            if (edu) {
                aisEduType = aisEntrant.data['edu'].ceducation ? aisEduTypeById[aisEntrant.data['edu'].ceducation] : null
            }

            const aisCitizenId = parseInt(aisEntrant.data['csitizen']);
            const aisCountryId = parseInt(aisEntrant.data['ccontry']) || 14;

            let citizenshipCode = 'russia',
                citizenshipCountryId = 1

            const aisCitizenType = aisCitizenTypeById[aisCitizenId]

            if (aisCitizenType) {
                citizenshipCode = aisCitizenType.code
            }

            const citizenshipCountry: EduCountryModel = await this.eduCountryService.model.findOne({aisId: aisCountryId}) as EduCountryModel

            if (citizenshipCountry) {
                citizenshipCountryId = citizenshipCountry.nid
            } else {
                console.log(aisCountryId, 'not found country')
            }

            const address = [
                aisEntrant.data['KLADR_Reg'],
                aisEntrant.data['KLADR_Gor'],
                aisEntrant.data['KLADR_UL'],
                aisEntrant.data['KLADR_Dom'] ? 'д ' + aisEntrant.data['KLADR_Dom'] : '',
                aisEntrant.data['KLADR_Kvart'] ? 'кв ' + aisEntrant.data['KLADR_Kvart'] : '',
            ].filter(item => !!item).join(', ')

            order.anket.personal.needFlat = aisEntrant.data['obsh'] === 't' || aisEntrant.data['obsh'] === 'T'

            order.updateEmptyFields({
                'anket.personal.citizenship': citizenshipCode,
                'anket.personal.citizenshipCountry': citizenshipCountryId,
                'anket.personal.firstName': aisEntrant.firstName,
                'anket.personal.lastName': aisEntrant.lastName,
                'anket.personal.secondName': aisEntrant.secondName,
                'anket.personal.gender': aisEntrant.data['csex'] === '1' ? 'male' : 'female',
                'anket.personal.birthday': aisEntrant.data['birthday'] ? dayjs(aisEntrant.data['birthday'].split(' ')[0]).format('DD.MM.YYYY') : null,
                'anket.personal.birthplace': aisEntrant.data['bplace'],
                'anket.personal.phone': aisEntrant.phone ? aisEntrant.phone.replace(/[^\d]/g, '') : null,
                'anket.personal.email': aisEntrant.email,
                'anket.education.prevEduLevel': aisEduType ? aisEduType.cisEduLevel : null,
            })

            if (address) {
                if (!order.anket.personal.addressReg['name']) {
                    order.anket.personal.addressReg['name'] = address
                    order.anket.personal.addressReg['custom'] = true
                }
                if (!order.anket.personal.addressLive['name']) {
                    order.anket.personal.addressLive['name'] = address
                    order.anket.personal.addressLive['custom'] = true
                }
            }

            // CREATE PASSPORT

            const docs = await order.getDocs()

            if (aisEntrant.passport_num) {

                let doc = docs.find(doc => doc.type === EduDocRoleEnum.PASSPORT && doc.docNumber.trim() === aisEntrant.passport_num.trim())

                if (!doc) {

                    doc = this.docService.createModel({})
                    doc.createSource = AbitWorkplaceEnum.AIS

                    doc.orderId = order.id
                    doc.type = EduDocRoleEnum.PASSPORT
                    doc.docSeries = aisEntrant.passport_ser
                    doc.docNumber = aisEntrant.passport_num
                    doc.docOrg = aisEntrant.data['passport_place']
                    doc.issueDate = formatAisDate(aisEntrant.data['passport_date'])

                    doc.fields['SubdivisionCode'] = aisEntrant.data['passport_podr']
                    doc.fields['Surname'] = aisEntrant.lastName
                    doc.fields['Name'] = aisEntrant.firstName
                    doc.fields['Patronymic'] = aisEntrant.secondName
                    doc.fields['IdOksm'] = citizenshipCountry ? citizenshipCountry.epguId : ''

                    doc.docCategoryId = 1

                    switch (aisCitizenId) {
                        case aisCitizenTypeEnum.RUSSIA:
                            doc.docTypeId = 100001 // рф
                            break;
                        default:
                            doc.docTypeId = 100040 // Паспорт гражданина иностранного государства
                            break;
                    }

                    await doc.savePromise()
                }
            }

            // CREATE EDU

            if (edu) {

                let doc = docs.find(doc => doc.type === EduDocRoleEnum.EDU)

                if (!doc && aisEduType) {

                    //console.log('aisEduType')
                    //console.log(aisEduType)
                    let isForeignEdu = false

                    doc = this.docService.createModel({})
                    doc.createSource = AbitWorkplaceEnum.AIS

                    doc.orderId = order.id

                    doc.type = EduDocRoleEnum.EDU
                    doc.docSeries = aisEntrant.data['ser']
                    doc.docNumber = aisEntrant.data['num']
                    doc.issueDate = formatAisDate(aisEntrant.data['dateatt'])

                    doc.docTypeId = aisEduType.epguDocTypeId
                    doc.docCategoryId = await this.docService.getDocCategoryIdByDocType(doc.docTypeId)

                    if (edu.school) {

                        if (edu.school.place) {
                            if (edu.school.place.match(new RegExp('Страна|Киргизия|Таджикистан', "i"))) {
                                isForeignEdu = true
                            }
                        }

                        if (order.eduTypeSlug === 'bak' && isForeignEdu) {
                            doc.docTypeId = 213142
                        }

                        const school: any = edu.school
                        const schoolTypeName = AisSchoolTypes[school.csctype]

                        if (schoolTypeName !== 'ВУЗ' && !school.name.match(new RegExp(schoolTypeName, "i"))) {
                            doc.docOrg = schoolTypeName + ' ' + school.name + ' ' + ', ' + school.place
                        } else {
                            doc.docOrg = school.name + ' ' + ', ' + school.place
                        }
                    }

                    await doc.savePromise()
                }

            }


        } else {

            if (!order.anket.personal.doc.serial)
                order.anket.personal.doc.serial = aisEntrant.passport_ser

            if (!order.anket.personal.doc.number)
                order.anket.personal.doc.number = aisEntrant.passport_num

            if (
                order.state.status === AbitOrderStatusEnum.DRAFT
            ) {
                order.state.status = AbitOrderStatusEnum.ACCEPTED
            }
        }

        const aisRegnum = aisEntrant.data['regn'] ? parseInt(aisEntrant.data['regn']) : null

        for (const aisSubject of aisEntrant.subjects) {

            const subject = (await this.subjectService.getSubjectsById())[aisSubject.csubject]

            if (
                (
                    ((aisSubject.passingType === AbitTestPassingTypeEnum.EGE) && subject.isEge)
                    ||
                    (aisSubject.passingType === AbitTestPassingTypeEnum.GIA)
                    ||
                    aisSubject.csubject === 27
                )
                && aisSubject.mark
            ) {
                const passingType = aisSubject.csubject === 27 ? AbitTestPassingTypeEnum.GIA : aisSubject.passingType

                let foundTest = await this.abitTestService.query().where({
                    orderId: order.id,
                    csubject: aisSubject.csubject,
                    passingType: passingType
                }).execOne()

                if (!foundTest) {
                    foundTest = this.abitTestService.createModel({})
                    foundTest.orderId = order.id
                    foundTest.orderNid = order.nid
                    foundTest.csubject = aisSubject.csubject
                    foundTest.createSource = AbitWorkplaceEnum.AIS
                    foundTest.passingType = passingType
                    foundTest.abitEgeBall = aisSubject.mark
                    foundTest.resultBall = aisSubject.mark
                    await foundTest.savePromise()
                } else {
                    if (!foundTest.resultBall) {
                        foundTest.abitEgeBall = aisSubject.mark
                        foundTest.resultBall = aisSubject.mark
                        await foundTest.savePromise()
                    }
                }
            }

        }


        if (!order.ais.aisId || override) {

            if (aisEntrant.apps.length) {

                let budgetPriority = 1
                let paidPriority = 1

                for (const aisApp of aisEntrant.getAppsSorted()) {

                    let priority

                    if (aisApp.csource === 3) {
                        priority = paidPriority++
                    } else {
                        priority = budgetPriority++
                    }

                    let compet

                    if (order.eduTypeSlug === 'bak' && (aisApp.csource !== 3)) {
                        compet = await this.competitionService.query().where({
                            cadmission: aisApp.cadmission,
                            csource: aisApp.csource,
                            isdop: true
                        }).execOne()
                    } else {
                        compet = await this.competitionService.query().where({
                            uid: aisApp.competitionUid,
                            isdop: {$ne: true}
                        }).execOne()
                    }

                    const app = await this.orderService.updateAppFromAis(order, aisApp, priority, aisEntrant, compet)
                }
            }
        }

        const firstApp = await order.fetchAndUpdateFirstApp()

        if (firstApp && !order.cinstitute) {
            await this.orderService.setOrderInstitute(order, firstApp, false, false)
        }

        order.regnum = aisRegnum

        order.ais.aisId = aisEntrant.id
        order.ais.citem = aisEntrant.citem
        order.ais.aisStatusId = aisEntrant.state
        order.ais.name = aisEntrant.data['name']
        order.ais.registerAt = formatAisDate(aisEntrant.data['appldate'], 'jsdate')
        order.ais.state = aisEntrant.data

        await order.savePromise()

        return orderNew ? 'create' : 'update'
    }
}
