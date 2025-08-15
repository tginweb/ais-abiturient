import {BadRequestException, Injectable} from '@nestjs/common';
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {AbitOrderModel} from '../../core/order/model';
import {EduLevelService} from "~modules/edu-org/modules/level/core/service";
import {EduFobService} from "~modules/edu-org/modules/fob/core/service";
import {EduCampaignService} from "~modules/edu-org/modules/campaign/core/service";
import {EntityService} from "~modules/entity/entity.service";
import {EduAdminService} from "~modules/edu-org/admin/service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {EduInstituteService} from "~modules/edu-org/modules/institute/core/service";
import {EduQuotaTypeService} from "~modules/edu-org/modules/quota-type/core/service";
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app/service";
import {EduAchievementService} from "~modules/edu-org/modules/achievement/core/type/service";
import {AbitOrderTypeService} from "../../core/order-type/service";
import {AbitOrderService} from "../../core/order/service";
import {UserService} from "~modules/user/core/user.service";
import {EduSubjectService} from "~modules/edu-org/modules/subject/core/service";
import {AbitTestService} from "~modules/edu-org/modules/abit/core/test/service";
import {AbitTestPassingTypeEnum} from "~modules/edu-org/modules/abit/core/test/enum";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
import {FileService} from "~modules/file/core/service";
import {EduDocRoleEnum, EduDocStatusEnum} from "~modules/edu-org/modules/doc/core/enum";
import {EduCompetitionService} from "~modules/edu-org/modules/competition/core/service";
import {AbitOrderAdminQuery as ModelQuery} from "./query";
import {EduSourceService} from "~modules/edu-org/modules/source/core/service";
import {EduCountryService} from "~modules/edu-org/modules/country/core/service";
import {EduEpguDictionaryService} from "~modules/edu-org/modules/epgu-dictionary/core/service";
import {AbitOrderOldModel} from "~modules/edu-org/modules/abit/core/order/model-old";
import {AbitOrderOldService} from "~modules/edu-org/modules/abit/core/order/service-old";
import {AbitOrderStatusEnum} from "~modules/edu-org/modules/abit/core/order/statics/status";
import {Achievement} from "~modules/edu-org/modules/abit/core/order/subdoc/anket/entrace/achievment";
import {EduDocService} from "~modules/edu-org/modules/doc/core/service";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {EduOrderMessageService} from "~modules/edu-org/modules/order-message/core";
import {UserModel} from "~modules/user/core/model/user.model";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app";
import {EduDecreeService} from "~modules/edu-org/modules/decree/core";

@Injectable()
export class AbitOrderAdminService {

    getFiltersTree = require('./service-methods/getFiltersTree').default
    fisResultsImport = require('./service-methods/fisResultsImport').default

    constructor(
        protected readonly userService: UserService,
        public readonly coreService: AbitOrderService,
        public readonly orderOldService: AbitOrderOldService,
        protected readonly entityService: EntityService,
        protected readonly aisService: EduAisService,
        protected readonly abitOrderTypeService: AbitOrderTypeService,
        protected readonly abitAppService: AbitAppService,
        protected readonly fileService: FileService,
        protected readonly subjectService: EduSubjectService,
        protected readonly abitTestService: AbitTestService,
        protected readonly eduAdminService: EduAdminService,
        protected readonly eduLevelService: EduLevelService,
        protected readonly eduSourceService: EduSourceService,
        protected readonly eduSubjectService: EduSubjectService,
        protected readonly eduInstituteService: EduInstituteService,
        protected readonly eduAchievementService: EduAchievementService,
        protected readonly eduQuotaTypeService: EduQuotaTypeService,
        protected readonly eduFobService: EduFobService,
        protected readonly eduCampaignService: EduCampaignService,
        protected readonly countryService: EduCountryService,
        public readonly eduAdmissionService: EduAdmissionService,
        private competitionService: EduCompetitionService,
        private docService: EduDocService,
        private eduCountryService: EduCountryService,
        private epguDictionaryService: EduEpguDictionaryService,
        private eduOrderMessageService: EduOrderMessageService,
        public decreeService: EduDecreeService,
    ) {
        this.entityService.registerEntityType('edu_order', {
            label: '',
            adminService: this
        })
    }

    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.coreService.modelContext()).where({deleted: {$ne: true}})
    }

    get model() {
        return this.coreService.model
    }

    async findEntrantOrderByData(data, excludeId = null): Promise<{ order: AbitOrderModel, by: string } | null> {

        let order: AbitOrderModel, foundBy

        const globalFilter: any = {}

        if (excludeId) {
            globalFilter._id = {$ne: excludeId}
        }

        if (data.aisId) {
            order = await this.query().where({'ais.aisId': data.aisId, ...globalFilter}).sort({nid: -1}).execOne()
            foundBy = 'aisId'
        }

        if (data.eduType) {
            globalFilter.eduType = data.eduType
        }

        if (!order && data.snils) {
            order = await this.query().where({'anket.personal.snils': data.snils, ...globalFilter}).sort({nid: -1}).execOne()
            foundBy = 'snils'
        }

        if (!order && data.inn) {
            order = await this.query().where({'anket.personal.inn': data.inn, ...globalFilter}).sort({nid: -1}).execOne()
            foundBy = 'inn'
        }

        if (!order && data.docSerial && data.docNumber) {

            order = await this.query().where({
                'anket.personal.doc.serial': data.docSerial.trim(),
                'anket.personal.doc.number': data.docNumber.trim(),
                ...globalFilter
            }).sort({nid: -1}).execOne()

            foundBy = 'passport'
        }

        if (!excludeId) {
            if (order && (order.state.status === AbitOrderStatusEnum.DRAFT)) {
                const foundBest = await this.findEntrantOrderByData(data, order._id)
                if (foundBest) {
                    if (foundBest.order.state.status !== AbitOrderStatusEnum.DRAFT) {
                        return foundBest
                    }
                }
            }
        }

        return order ? {order: order, by: foundBy} : null
    }

    async updateDocs(order: AbitOrderModel, inputDocs: any): Promise<Boolean> {

        const docs = await order.getDocs()

        for (const doc of docs) {

            if (inputDocs[doc.id]) {
                const inputDoc = inputDocs[doc.id]

                if (inputDoc.toDelete && doc.canDeleteAdmin) {
                    await doc.deletePromise()
                } else {
                    if (inputDoc.statusId)
                        doc.statusId = inputDoc.statusId

                    await doc.savePromise()
                }
            }
        }

        return true
    }

    async updateApps(order: AbitOrderModel, inputGroups: any): Promise<Boolean> {

        const appGroups = await order.getAppGroups()

        let statusesMap = {}

        let inOrderApp: AbitAppModel

        for (const appGroup of appGroups) {

            const savedApps = await appGroup.getApps()

            let inputGroupApps = []

            if (inputGroups[appGroup.id]) {
                inputGroupApps = inputGroups[appGroup.id]
            }

            for (const savedApp of savedApps) {

                const inputApp = inputGroupApps.find(inputApp => {
                    return inputApp.id === savedApp.id
                })

                let statusId = savedApp.statusId

                if (inputApp) {
                    if (inputApp.statusIdNew) {
                        statusId = inputApp.statusIdNew
                    }
                }

                if (!statusesMap[statusId]) {
                    statusesMap[statusId] = 0
                }
                statusesMap[statusId]++
            }
        }

        if (statusesMap[11] && statusesMap[11]>1) {
            throw new BadRequestException('Нельзя включать в приказ более одного заявления');
        }

        for (const appGroup of appGroups) {

            if (inputGroups[appGroup.id]) {

                const inputGroupApps = inputGroups[appGroup.id]

                const savedApps = await appGroup.getApps()

                for (const savedApp of savedApps) {


                    const inputApp = inputGroupApps.find(inputApp => {
                        return inputApp.id === savedApp.id
                    })

                    if (inputApp) {

                        savedApp.ver = 1
                        savedApp.cancelReasonId = inputApp.cancelReasonId
                        savedApp.cancelReasonMessage = inputApp.cancelReasonMessage

                        savedApp.bvi = inputApp.bvi
                        savedApp.priority = parseInt(inputApp.priority)

                        if (inputApp.statusIdNew) {
                            savedApp.statusId = inputApp.statusIdNew
                        }

                        await savedApp.savePromise()
                    }

                    if (savedApp.statusId === 11 || savedApp.statusId === 19) {
                        inOrderApp = savedApp
                    }
                }
            }
        }

        if (inOrderApp) {
            order.prezachCompetitionId = inOrderApp.competitionId
            order.zachCompetitionId = inOrderApp.competitionId
        } else if (order.zachCompetitionId)  {
            order.prezachCompetitionId = null
            order.zachCompetitionId = null
        }

        await order.fetchAndUpdateFirstApp()

        return true
    }

    async updateTests(order: AbitOrderModel, inputTests: any): Promise<Boolean> {

        const tests = await order.getTests()

        for (const inputTest of inputTests) {
            if (inputTest.isNew) {
                const subject = await this.eduSubjectService.query().where({id: inputTest.csubject}).execOne()

                if (subject) {
                    const test = this.abitTestService.createModel({})
                    test.fio = order.getFio()
                    test.snils = order.getSnils()
                    test.orderId = order.id
                    test.orderNid = order.nid
                    test.csubject = inputTest.csubject
                    test.abitEgeBall = inputTest.abitEgeBall
                    test.passingType = inputTest.passingType
                    test.resultBall = inputTest.resultBall
                    test.resultType = inputTest.resultBall > 0 ? 'admin' : null
                    test.isEge = subject.isEge
                    await test.savePromise()
                }
            } else {
                const test = tests.find(test => test.id === inputTest.id)
                if (test) {
                    if (inputTest.toDelete) {
                        if (test.canDeleteAdmin)
                            await test.deletePromise()
                    } else {
                        test.passingType = inputTest.passingType
                        test.abitEgeBall = inputTest.abitEgeBall
                        test.abitEgeYear = inputTest.abitEgeYear

                        if (
                            test.passingType === AbitTestPassingTypeEnum.EGE ||
                            test.passingType === AbitTestPassingTypeEnum.INTERNAL ||
                            test.passingType === AbitTestPassingTypeEnum.GIA
                        ) {
                            test.resultBall = inputTest.resultBall
                        }

                        await test.savePromise()
                    }
                }
            }
        }

        return true
    }

    async updateAchievements(order: AbitOrderModel, inputItems: any): Promise<Boolean> {
        for (const inputItem of inputItems) {
            let item
            if (inputItem.isNew) {
                item = {
                    achievementType: inputItem.achievementType,
                    ball: inputItem.ball,
                    statusId: inputItem.statusId,
                    docId: inputItem.docId
                }
                order.anket.entrance.achievements.push(item)
            } else {
                item = order.anket.entrance.achievements['id'](inputItem.id)
                item.set({
                    ball: inputItem.ball,
                    statusId: inputItem.statusId,
                    docId: inputItem.docId
                })
            }
        }
        await order.savePromise()
        return true
    }

    async portFile(fileId, doc) {
        const file = await this.fileService.query().getById(fileId)
    }

    async entityAction_calc_decree(order: AbitOrderModel, params) {

        let foundApp: AbitAppModel

        if (order.decreeNid === 3)
            return;

        if (order.prezachCompetitionId) {

            const compet = await this.competitionService.query().where({
                id: order.prezachCompetitionId,
            }).execOne()

            if (order.eduTypeSlug === 'bak') {

                if (compet.isdop) {
                    switch (compet.csource) {
                        case 1:
                            order.decreeNid = 7 // Бакспец, допнабор, бюджет
                            break;
                        case 2:
                            order.decreeNid = 11 // Бакспец, допнабор, особая квота
                            break;
                        case 3:
                            break;
                        case 4:
                            order.decreeNid = 9 // Бакспец, допнабор, целевая квота
                            break;
                        case 5:
                            order.decreeNid = 10 // Бакспец, допнабор, отдельная квота
                            break;
                    }
                } else {
                    switch (compet.csource) {

                        case 1:
                            order.decreeNid = 4 // Бакспец, бюджет, общий конкурс
                            break;
                        case 2:
                            order.decreeNid = 1 // Бакспец, бюджет, особое право
                            break;
                        case 3:
                            break;
                        case 4:
                            order.decreeNid = 12 // Бакспец, бюджет, целевая квота
                            break;
                        case 5:
                            order.decreeNid = 2 // Бакспец, бюджет, отдельная квота
                            break;
                    }
                }
            }

        } else {
            order.decreeNid = null
        }

        await order.savePromise()
    }

    async entityAction_to_order_dopnabor_budget(order: AbitOrderModel, params) {
        order.decreeNid = 7
        await order.savePromise()
    }

    async entityAction_to_order_mag_budget(order: AbitOrderModel, params) {
        order.decreeNid = 6
        await order.savePromise()
    }

    async entityAction_to_order_osob_quota(order: AbitOrderModel, params) {
        order.decreeNid = 1
        await order.savePromise()
    }

    async entityAction_to_order_otdel_quota(order: AbitOrderModel, params) {
        order.decreeNid = 2
        await order.savePromise()
    }

    async entityAction_to_order_bvi(order: AbitOrderModel, params) {
        order.decreeNid = 3
        await order.savePromise()
    }

    async entityAction_to_order_obsh(order: AbitOrderModel, params) {
        order.decreeNid = 4
        await order.savePromise()
    }

    async entityAction_to_order_zaoch_commerce(order: AbitOrderModel, params) {
        order.decreeNid = 5
        await order.savePromise()
    }

    async entityAction_normalize_priority(order: AbitOrderModel, params) {


        await this.coreService.normalizeAppsPriorites(order)
    }

    async entityAction_app_inorder_to_prezach(order: AbitOrderModel, params) {

        let foundApp: AbitAppModel
        for (const appGroup of await order.getAppGroups()) {
            const apps = await appGroup.getActiveAppsCollection()
            for (const app of apps.all()) {
                if (app.statusId === AppStatusEnum.INORDER) {
                    foundApp = app
                }
            }
        }

        if (foundApp) {
            order.prezachCompetitionId = foundApp.competitionId
            order.prezachStatus = 'accepted'
            await order.savePromise()
        }
    }

    async entityAction_prezach_to_zach(order: AbitOrderModel, params) {

        if (order.prezachCompetitionId && order.prezachStatus === 'accepted') {

            let foundApp: AbitAppModel

            for (const appGroup of await order.getAppGroups()) {
                const apps = await appGroup.getActiveAppsCollection()
                for (const app of apps.all()) {
                    if (app.competitionId === order.prezachCompetitionId) {
                        foundApp = app
                    }
                }
            }

            if (foundApp) {
                foundApp.statusId = AppStatusEnum.INORDER
                await foundApp.savePromise()
            }

            order.zachCompetitionId = order.prezachCompetitionId
            await order.savePromise()
        }
    }


    async entityAction_appsErrorsCalc(order: AbitOrderModel, params) {
        order.appsErrors = await order.getAppsErrors()
        await order.savePromise()
    }

    async entityAction_move_dopnab(order: AbitOrderModel, params) {

        const appsToMove: AbitAppModel[] = []

        for (const appGroup of await order.getAppGroups()) {
            const apps = await appGroup.getAppsCollection()
            for (const app of apps.all()) {
                const compet = await app.getCompetition()
                if (compet.isdop) {
                    appsToMove.push(app)
                }
            }
        }

        if (appsToMove.length) {
            const appGroup = await order.ensureAppGroup(true, true)

            if (appGroup) {
                for (const app of appsToMove) {
                    app.appGroupId = appGroup.id
                    await app.savePromise()
                }
            }
        }

    }

    async entityAction_wasAccepted(order: AbitOrderModel, params) {

        const messages = await this.eduOrderMessageService.getMessagesByOrder(order.id)
        for (const message of messages) {
            if (message.message.title) {
                if (message.message.title.match(/Принято\:\s+Участвует в конкурсе/i)) {
                    order.lk.wasAccepted = true
                    await order.savePromise()
                }
            }
        }
    }

    async entityAction_delete(order: AbitOrderModel, params, user: UserModel) {

        if (!user.isAdmin)
            return;


        order.deleted = true

        for (const app of (await order.getApps())) {
            app.deleted = true
            await app.savePromise()
        }

        for (const appGroup of (await order.getAppGroups())) {
            appGroup.deleted = true
            await appGroup.savePromise()
        }

        await order.savePromise()
    }


    async entityAction_first_app_update(order: AbitOrderModel, params) {
        await order.fetchAndUpdateFirstApp()
    }

    async entityAction_ensure_docs_internal(order: AbitOrderModel, params) {
        await this.coreService.ensureOrderInternalDocs(order)
    }

    async entityAction_port_part(order: AbitOrderModel, params) {

        await this.entityAction_ensure_docs_internal(order, params)
        await this.entityAction_port_docs_packet(order, params)
        await this.entityAction_fill_required_tests(order, params)

        await order.fetchAndUpdateFirstApp()
    }

    async entityAction_port_all(order: AbitOrderModel, params) {

        await this.entityAction_ensure_docs_internal(order, params)
        await this.entityAction_port_dul(order, params)
        await this.entityAction_port_edu(order, params)
        await this.entityAction_port_tests(order, params)
        await this.entityAction_port_apps(order, params)
        await this.entityAction_port_docs_packet(order, params)

        order.lk.portedAll = true

        await order.fetchAndUpdateFirstApp()
    }

    async entityAction_port_docs_packet(order: AbitOrderModel, params) {

        const files = order.allFiles
        const docs = await order.getDocs(true)

        for (const file of files) {

            if (file.path === 'send.photoFile') {
                let doc = docs.find(doc => doc.type === EduDocRoleEnum.PHOTO)
                if (!doc) {
                    doc = this.docService.createForOrderByAbit(order, {
                        type: EduDocRoleEnum.PHOTO
                    })
                }
                if (!doc.files.length) {
                    doc.files = [file.file]
                    await doc.savePromise()
                }
            }

            if (file.path === 'send.orderDocFile') {
                let doc = docs.find(doc => doc.type === EduDocRoleEnum.APP)
                if (!doc) {
                    doc = this.docService.createForOrderByAbit(order, {
                        type: EduDocRoleEnum.APP
                    })
                }
                if (!doc.files.length) {
                    doc.files = file.file
                    await doc.savePromise()
                }
            }

            if (file.path === 'send.consentDocFile') {
                let doc = docs.find(doc => doc.type === EduDocRoleEnum.CONSENT)
                if (!doc) {
                    doc = this.docService.createForOrderByAbit(order, {
                        type: EduDocRoleEnum.CONSENT
                    })
                }
                if (!doc.files.length) {
                    doc.files = file.file
                    await doc.savePromise()
                }
            }

            if (file.path === 'send.consentDocFile') {
                let doc = docs.find(doc => doc.type === EduDocRoleEnum.CONSENT_DIST)
                if (!doc) {
                    doc = this.docService.createForOrderByAbit(order, {
                        type: EduDocRoleEnum.CONSENT_DIST
                    })
                }
                if (!doc.files.length) {
                    doc.files = file.file
                    await doc.savePromise()
                }
            }

            if (file.path === 'send.targetContractDocFile') {
                let doc = docs.find(doc => doc.type === EduDocRoleEnum.TARGET)
                if (!doc) {
                    doc = this.docService.createForOrderByAbit(order, {
                        type: EduDocRoleEnum.TARGET
                    })
                }
                if (!doc.files.length) {
                    doc.files = file.file
                    await doc.savePromise()
                }
            }

            if (file.path === 'anket.entrance.achievements') {

                const achievementTypesById = await this.eduAchievementService.getAllById()

                if (file.children.length) {

                    for (const ach of file.children) {

                        const achievement = order.anket.entrance.achievements.find(item => item.achievementType === ach.term.id)

                        if ([1, 11, 22].indexOf(ach.term.id) > -1) {
                            if (achievement) {
                                const eduDoc = docs.find(doc => doc.type === EduDocRoleEnum.EDU)
                                if (eduDoc) {
                                    achievement['set']({
                                        docId: eduDoc.id
                                    })
                                }
                            }
                            continue;
                        }

                        const achievementType = achievementTypesById[ach.term.id]

                        let doc = docs.find(doc => doc.type === EduDocRoleEnum.ACHIEVEMENT && doc.achievementTypeId === ach.term.id)

                        if (!doc) {

                            doc = this.docService.createForOrderByAbit(order, {
                                type: EduDocRoleEnum.ACHIEVEMENT,
                                achievementTypeId: ach.term.id,
                            })

                            if (achievementType.epguDocTypeId) {
                                const {docCat} = await this.docService.getInfoByTypeId(achievementType.epguDocTypeId)
                                doc.docTypeId = achievementType.epguDocTypeId
                                if (docCat)
                                    doc.docCategoryId = docCat.id
                            }
                        }

                        if (!doc.files.length) {
                            doc.files = ach.file
                            await doc.savePromise()
                        }

                        if (achievement) {
                            achievement['set']({
                                docId: doc.id
                            })
                        }
                    }
                }
            }

        }

        await order.savePromise()
    }

    async entityAction_port_tests(order: AbitOrderModel, params) {

        if (order.eduTypeSlug === 'spo') {

            let foundTest = await this.abitTestService.query().where({
                orderId: order.id,
                csubject: 27
            }).execOne()

            if (!foundTest) {
                foundTest = this.abitTestService.createModel({})
                foundTest.orderId = order.id
                foundTest.orderNid = order.nid
                foundTest.csubject = 27
                foundTest.createSource = AbitWorkplaceEnum.CIS_ABIT
                foundTest.passingType = AbitTestPassingTypeEnum.GIA
            }

            const schoolBall = order.anket.entrance.schoolCertificateBall

            if (schoolBall && !foundTest.resultBall) {
                foundTest.abitEgeBall = schoolBall
                foundTest.abitEgeReady = true
                foundTest.resultBall = schoolBall
            }

            await foundTest.savePromise()

        } else if (order.eduTypeSlug === 'mag') {

            let foundTest = await this.abitTestService.query().where({
                orderId: order.id,
                csubject: 25
            }).execOne()

            if (!foundTest) {
                foundTest = this.abitTestService.createModel({})
                foundTest.orderId = order.id
                foundTest.orderNid = order.nid
                foundTest.csubject = 25
                foundTest.createSource = AbitWorkplaceEnum.CIS_ABIT
                foundTest.passingType = AbitTestPassingTypeEnum.INTERNAL

                foundTest.abitEgeBall = 0
                foundTest.abitEgeReady = false
                foundTest.resultBall = 0
                await foundTest.savePromise()
            }

        } else {
            for (const oldSubject of order.anket.entrance.subjects) {

                let oldSubjectPassingType

                if (oldSubject.status === 'internal') {
                    oldSubjectPassingType = 'internal'
                } else {
                    oldSubjectPassingType = 'ege'
                }

                let foundTest = await this.abitTestService.query().where({
                    orderId: order.id,
                    csubject: oldSubject.subject,
                    passingType: oldSubjectPassingType
                }).execOne()

                if (!foundTest) {
                    foundTest = this.abitTestService.createModel({})
                    foundTest.orderId = order.id
                    foundTest.orderNid = order.nid
                    foundTest.csubject = oldSubject.subject
                    foundTest.createSource = AbitWorkplaceEnum.CIS_ABIT

                    if (oldSubjectPassingType === 'internal') {
                        foundTest.passingType = AbitTestPassingTypeEnum.INTERNAL
                    } else {
                        foundTest.passingType = AbitTestPassingTypeEnum.EGE
                    }

                    if (oldSubject.status === 'ready') {
                        foundTest.abitEgeReady = true
                    } else {
                        foundTest.abitEgeReady = false
                    }
                }

                if (oldSubject.score && (!foundTest.abitEgeBall || (foundTest.abitEgeBall < oldSubject.score))) {
                    foundTest.abitEgeBall = oldSubject.score
                    if (oldSubject.year)
                        foundTest.abitEgeYear = oldSubject.year
                }

                await foundTest.savePromise()
            }
        }
    }


    async entityAction_port_dul(order: AbitOrderModel, params) {

        const docs = await order.getDocs(true)

        let doc = docs.find(doc => doc.type === EduDocRoleEnum.PASSPORT)

        const anketDoc = order.anket.personal.doc

        if (anketDoc.number) {

            let newDoc

            if (!doc) {
                doc = this.coreService.eduDocService.createModel({})
                doc.orderId = order.id
                doc.type = EduDocRoleEnum.PASSPORT
                doc.docCategoryId = 1
                doc.isMain = true
                doc.createSource = AbitWorkplaceEnum.CIS_ABIT
                doc.statusId = EduDocStatusEnum.NOT_CHECKED
                newDoc = true
            }

            if (newDoc || !!doc.docNumber) {

                switch (order.anket.personal.docType) {
                    case 1:
                        doc.docTypeId = 100001
                        break;
                    case 2:
                        doc.docTypeId = 100039
                        break;
                    case 3:
                        doc.docTypeId = 100040
                        break;
                }

                doc.docSeries = anketDoc.serial
                doc.docNumber = anketDoc.number
                doc.docOrg = anketDoc.organization
                doc.issueDate = anketDoc.date

                const fields: any = {...doc.fields}

                fields.SubdivisionCode = anketDoc.subcode
                fields.IdOksm = 185
                fields.Surname = order.anket.personal.lastName
                fields.Name = order.anket.personal.firstName
                fields.Patronymic = order.anket.personal.secondName

                doc.fields = fields
            }

            if ((!doc.files || !doc.files.length) && order.anket.personal.docFile.length) {
                doc.files = order.anket.personal.docFile.map(id => id.toString())
            }

            await doc.savePromise()
        }

    }

    async entityAction_port_edu(order: AbitOrderModel, params) {

        const docs = await order.getDocs(true)

        let doc = docs.find(doc => doc.type === EduDocRoleEnum.EDU)

        const anketDoc = order.anket.education.doc

        if (anketDoc.number) {

            let cisEduDocTypeId

            if (order.eduTypeSlug == 'bak') {
                cisEduDocTypeId = order.anket.education.docType
                if (cisEduDocTypeId === 2)
                    cisEduDocTypeId = 1
            } else if (order.eduTypeSlug == 'spo') {
                cisEduDocTypeId = order.anket.education.docType
                if (cisEduDocTypeId === 3)
                    cisEduDocTypeId = 2
            } else {
                cisEduDocTypeId = 3
            }

            let newDoc

            if (!doc) {
                doc = this.coreService.eduDocService.createModel({})
                doc.orderId = order.id
                doc.type = EduDocRoleEnum.EDU
                doc.isMain = true
                doc.createSource = AbitWorkplaceEnum.CIS_ABIT
                doc.statusId = EduDocStatusEnum.NOT_CHECKED
                newDoc = true
            }

            if (newDoc || !!doc.docNumber) {

                if (newDoc || !doc.docTypeId) {

                    switch (cisEduDocTypeId) {
                        case 1: // Аттестат о среднем (полном) общем образовании
                            doc.docCategoryId = 13
                            doc.docTypeId = 213007

                            if (!order.anket.education.prevEduLevel)
                                order.anket.education.prevEduLevel = 7
                            break;
                        case 2: // Аттестат об основном общем образовании
                            doc.docCategoryId = 13
                            doc.docTypeId = 1000001

                            if (!order.anket.education.prevEduLevel)
                                order.anket.education.prevEduLevel = 8
                            break;

                        case 3: // Диплом о высшем образовании
                            doc.docCategoryId = 10

                            if (!order.anket.education.prevEduLevel && order.anket.education.level) {
                                order.anket.education.prevEduLevel = order.anket.education.level
                            }

                            switch (order.anket.education.level) {
                                case 1:
                                    doc.docTypeId = 210061
                                    break;
                                case 2:
                                    doc.docTypeId = 210073
                                    break;
                                case 3:
                                    doc.docTypeId = 210074
                                    break;
                                case 4:
                                    doc.docTypeId = 209009
                                    break;
                                case 5:
                                    doc.docTypeId = 210086
                                    break;
                            }

                            break;

                        case 4: // Диплом о среднем профессиональном образовании
                            doc.docCategoryId = 9
                            doc.docTypeId = 209009
                            if (!order.anket.education.prevEduLevel)
                                order.anket.education.prevEduLevel = 4
                            break;
                    }
                }

                doc.docSeries = anketDoc.serial
                doc.docNumber = anketDoc.number
                doc.docOrg = anketDoc.organization
                doc.issueDate = anketDoc.date

                const fields: any = {...doc.fields}

                doc.fields = fields
                doc.files = order.anket.education.docFile.map(id => id.toString())
            }

            if ((!doc.files || !doc.files.length) && order.anket.personal.docFile.length) {
                doc.files = order.anket.personal.docFile.map(id => id.toString())
            }

            await doc.savePromise()
        }

    }

    async entityAction_port_apps(order: AbitOrderModel, params) {

        const apps = await order.getApps()

        const oldApps = order.applications.items

        let budgetPriority = 1
        let paidPriority = 1

        for (const oldApp of [...oldApps].sort((a, b) => ((a.priority > b.priority) ? 1 : -1))) {

            let app = apps.find((app) => app.cadmission === oldApp.eduProgramNid && app.csource === oldApp.csource)

            let priority

            if (oldApp.csource === 3) {
                priority = paidPriority++
            } else {
                priority = budgetPriority++
            }

            if (!app) {

                let compet

                if (order.eduTypeSlug === 'bak') {

                    if (oldApp.csource !== 3) {
                        compet = await this.competitionService.query().where({
                            cadmission: oldApp.eduProgramNid,
                            csource: oldApp.csource,
                            isdop: true
                        }).execOne()
                    } else {
                        compet = await this.competitionService.query().where({
                            cadmission: oldApp.eduProgramNid,
                            csource: oldApp.csource,
                            celevOrg: {$exists: false},
                            isdop: {$ne: true}
                        }).execOne()
                    }

                } else {
                    compet = await this.competitionService.query().where({
                        cadmission: oldApp.eduProgramNid,
                        csource: oldApp.csource,
                        celevOrg: {$exists: false},
                        isdop: {$ne: true}
                    }).execOne()
                }

                let appAddRes

                if (compet) {
                    appAddRes = await this.coreService.addAppFromPort(order, compet.id, priority)
                } else {
                    console.log(oldApp, 'compet not found')
                }

                if (appAddRes)
                    app = appAddRes

            } else {
                app.lk.priority = priority
                app.lk.statusId = oldApp.statusId

                if (
                    !app.isCanceled &&
                    (app.statusId !== AppStatusEnum.COMPET_MEMBER) &&
                    (app.statusId !== AppStatusEnum.INORDER)
                ) {

                    let statusId: AppStatusEnum

                    switch (order.state.status) {
                        case AbitOrderStatusEnum.SENDED:
                        case AbitOrderStatusEnum.FIX_APPS:
                        case AbitOrderStatusEnum.FIX_ANKET:
                        case AbitOrderStatusEnum.SENDED_FIXED:
                            if (order.cinstitute) {
                                statusId = AppStatusEnum.COMPET_MEMBER
                            } else {
                                statusId = AppStatusEnum.PENDING
                            }
                            break;
                        case AbitOrderStatusEnum.ACCEPTED:
                            statusId = AppStatusEnum.COMPET_MEMBER
                            break;
                    }

                    if (statusId)
                        app.statusId = statusId
                }

                await app.savePromise()
            }

        }
    }


    async entityAction_fist_set_exported(order: AbitOrderModel, params) {
        order.fis.exported = true
        order.fis.exportedSuccessDate = new Date()
        await order.savePromise()
    }

    async entityAction_fist_unset_exported(order: AbitOrderModel, params) {
        order.fis.exported = false
        order.fis.exportedSuccessDate = new Date()
        await order.savePromise()
    }


    async entityAction_set_fac_by_first(order: AbitOrderModel, params) {

        if (order.firstApp.cfac && (await order.isFacultyAccepted())) {
            order.cinstitute = order.firstApp.cfac
        } else {
            order.cinstitute = null
        }

        await order.savePromise()
    }

    async entityAction_delete_fac(order: AbitOrderModel, params) {
        if (!order.lk.wasAccepted && !order.epgu.guid) {
            order.cinstitute = null
            await order.savePromise()
        }
    }

    admissionsById = null

    async getAdmissionsById() {
        if (!this.admissionsById) {
            this.admissionsById = (await this.eduAdmissionService.query().execMany()).reduce((map, item) => {
                map[item.id] = item
                return map
            }, {})
        }
        return this.admissionsById
    }

    async entityAction_fill_required_tests(order: AbitOrderModel, params) {

        const admissionsById = this.getAdmissionsById()

        const cadmissions: Record<string, number> = {}

        for (const appGroup of await order.getAppGroups()) {
            const apps = await appGroup.getActiveAppsCollection()
            for (const app of apps.all()) {
                cadmissions[app.cadmission] = app.cadmission
            }
        }

        for (const cadmission of Object.values(cadmissions)) {

            const adm = admissionsById[cadmission]

            if (!adm)
                continue;

            for (const subj of adm.subjects) {

                if (subj.cexampasstype === 2 && subj.csubject < 40) {

                    let foundTest = await this.abitTestService.query().where({
                        orderId: order.id,
                        csubject: subj.csubject
                    }).execOne()

                    if (!foundTest) {
                        foundTest = this.abitTestService.createModel({})
                        foundTest.orderId = order.id
                        foundTest.orderNid = order.nid
                        foundTest.csubject = subj.csubject
                        foundTest.createSource = AbitWorkplaceEnum.CIS_ADMIN

                        if (order.eduTypeSlug === 'spo') {
                            foundTest.passingType = AbitTestPassingTypeEnum.GIA
                        } else {
                            foundTest.passingType = AbitTestPassingTypeEnum.INTERNAL
                        }
                        await foundTest.savePromise()
                    }
                }
            }
        }
    }

    async entityAction_custom(order: AbitOrderModel, params) {

        const orders = await this.coreService.query().where({}).execMany()

        const admissionsById = (await this.eduAdmissionService.query().execMany()).reduce((map, item) => {
            map[item.id] = item
            return map
        }, {})

        for (const order of orders) {

            await order.fetchAndUpdateFirstApp()

            await this.coreService.ensureOrderInternalDocs(order)

            await order.savePromise()

            // fill tests


        }


        /*
        const orders = await this.coreService.query().execMany()

        for (const order of orders) {

            const appGroups = await order.getAppGroups()

            for (const appGroup of appGroups) {
                if (order.sendDate) {
                    appGroup.registerAt = order.sendDate
                    await appGroup.savePromise()
                }
            }

            const cadmissions: Record<string, number> = {}

            for (const appGroup of await order.getAppGroups()) {
                const apps = await appGroup.getActiveAppsCollection()
                for (const app of apps.all()) {
                    cadmissions[app.cadmission] = app.cadmission
                }
            }

            for (const cadmission of Object.values(cadmissions)) {
                const adm = await this.eduAdmissionService.query().where({id: cadmission}).execOne()
                for (const subj of adm.subjects) {

                    if (subj.cexampasstype === 2 && subj.csubject<40) {

                        let foundTest = await this.abitTestService.query().where({
                            orderId: order.id,
                            csubject: subj.csubject
                        }).execOne()

                        if (!foundTest) {
                            foundTest = this.abitTestService.createModel({})
                            foundTest.orderId = order.id
                            foundTest.orderNid = order.nid
                            foundTest.csubject = subj.csubject
                            foundTest.createSource = AbitWorkplaceEnum.CIS_ADMIN

                            if (order.eduTypeSlug === 'spo') {
                                foundTest.passingType = AbitTestPassingTypeEnum.GIA
                            } else {
                                foundTest.passingType = AbitTestPassingTypeEnum.INTERNAL
                            }
                            await foundTest.savePromise()
                        }
                    }
                }
            }
        }

         */


    }

    async portOldOrder(oldOrder: AbitOrderOldModel) {

        let order: AbitOrderModel

        const haveBudget = oldOrder.applications.items.find(item => item.csource !== 3)


        if (oldOrder.state.status === AbitOrderStatusEnum.DRAFT) {
            return 'draft'
        }

        if (!oldOrder.snilsReal && !oldOrder.passportReal) {
            return 'no_snils_or_passport'
        }

        const found = await this.findEntrantOrderByData({
            snils: oldOrder.snilsReal,
            docSerial: oldOrder.passportReal ? oldOrder.passportSer : null,
            docNumber: oldOrder.passportReal ? oldOrder.passportNum : null,
        })

        if (found) {
            if (found.order.anket.personal.lastName.trim().toUpperCase() === oldOrder.anket.personal.lastName.trim().toUpperCase()) {
                order = found.order
            } else {
                console.log({
                    orderNid: found.order.nid,
                    orderFio: found.order.fio,
                    oldOrderNid: oldOrder.nid,
                    oldOrderFio: oldOrder.fio,
                }, 'NOT MATCH SNILS')
                return 'not_match_by_snils'
            }
        }

        if (order && ((oldOrder.eduTypeSlug=== 'bak') && haveBudget)) {

            order.isdop = true
            await order.savePromise()
            return 'isdop'
        }

        return 'skip'

        if (order) {

            if (oldOrder.uid !== order.uid) {

                if (order.anket.personal.lastName !== oldOrder.anket.personal.lastName) {
                    return 'UID and lastName not match'
                }

                if (!order.anket.personal.snils)
                    order.anket.personal.snils = oldOrder.anket.personal.snils
            }

            if (
                //(oldOrder.eduTypeSlug !== 'bak' || !haveBudget) &&
                (
                    oldOrder.state.status === AbitOrderStatusEnum.ACCEPTED ||
                    oldOrder.state.status === AbitOrderStatusEnum.SENDED ||
                    oldOrder.state.status === AbitOrderStatusEnum.SENDED_FIXED
                )
            ) {

                order.lk.id = oldOrder._id.toString()
                order.lk.nid = oldOrder.nid
                order.lk.createAt = oldOrder.createAt
                order.lk.updateAt = oldOrder.updateAt
                order.lk.sendDate = oldOrder.sendDate
                order.lk.portedUpdate = true
                order.lk.portedStatus = oldOrder.state.status
                order.lk.portedLast = true

                if (order.eduType !== oldOrder.eduType) {
                    console.log([order.eduType, oldOrder.eduType], 'edu-types')
                    return 'edu_type_not_match'
                }

               // return 'update-' + oldOrder.eduTypeSlug + '-' + (haveBudget ? 'budget' : 'commerce')

                order.eduType = oldOrder.eduType

                order.updateEmptyFields({
                    'userId': oldOrder.userId,

                    'anket.personal.snils': oldOrder.anket.personal.snils,
                    'anket.personal.inn': oldOrder.anket.personal.inn,

                    'anket.personal.citizenship': oldOrder.anket.personal.citizenship,
                    'anket.personal.citizenshipCountry': oldOrder.anket.personal.citizenshipCountry,
                    'anket.personal.firstName': oldOrder.anket.personal.firstName,
                    'anket.personal.lastName': oldOrder.anket.personal.lastName,
                    'anket.personal.secondName': oldOrder.anket.personal.secondName,
                    'anket.personal.gender': oldOrder.anket.personal.gender,
                    'anket.personal.birthday': oldOrder.anket.personal.birthday,
                    'anket.personal.birthplace': oldOrder.anket.personal.birthplace,
                    'anket.personal.phone': oldOrder.anket.personal.phone,
                    'anket.personal.phone2': oldOrder.anket.personal.phone2,
                    'anket.personal.email': oldOrder.anket.personal.email,

                    'anket.personal.docType': oldOrder.anket.personal.docType,
                    'anket.personal.doc.number': oldOrder.anket.personal.doc.number,
                    'anket.personal.doc.serial': oldOrder.anket.personal.doc.serial,
                    'anket.personal.doc.date': oldOrder.anket.personal.doc.date,
                    'anket.personal.doc.organization': oldOrder.anket.personal.doc.organization,
                    'anket.personal.doc.subcode': oldOrder.anket.personal.doc.subcode,
                    'anket.personal.docFile': oldOrder.anket.personal.docFile,

                    'anket.personal.docEgeHave': oldOrder.anket.personal.docEgeHave,
                    'anket.personal.docEge.serial': oldOrder.anket.personal.docEge.serial,
                    'anket.personal.docEge.number': oldOrder.anket.personal.docEge.number,

                    'anket.sendDate': oldOrder.sendDate,
                    'anket.coperator': oldOrder.coperator,
                })

                switch (order.state.status) {
                    case AbitOrderStatusEnum.DRAFT:
                        order.state.status = oldOrder.state.status
                        break;
                    case AbitOrderStatusEnum.SENDED:
                    case AbitOrderStatusEnum.SENDED_FIXED:
                    case AbitOrderStatusEnum.FIX_ANKET:
                    case AbitOrderStatusEnum.FIX_APPS:
                        if (
                            oldOrder.state.status === AbitOrderStatusEnum.ACCEPTED
                        ) {
                            order.state.status = oldOrder.state.status
                        }
                        break;
                }

                if (!order.anket.personal.addressReg['name']) {
                    order.anket.personal.addressReg = oldOrder.anket.personal.addressReg
                }
                if (!order.anket.personal.addressLive['name']) {
                    order.anket.personal.addressLive = oldOrder.anket.personal.addressLive
                }

                order.anket.personal.addressEqual = oldOrder.anket.personal.addressEqual

                order.anket.personal.family = oldOrder.anket.personal.family
                order.anket.personal.languages = oldOrder.anket.personal.languages
                order.anket.personal.languageCustom = oldOrder.anket.personal.languageCustom

                if (typeof order.anket.personal.needFlat !== 'boolean') {
                    order.anket.personal.needFlat = oldOrder.anket.personal.needFlat
                }

                order.updateEmptyFields({
                    'anket.education.docType': oldOrder.anket.education.docType,
                    'anket.education.docCountryType': oldOrder.anket.education.docCountryType,
                    'anket.education.docCity': oldOrder.anket.education.docCity,

                    'anket.education.doc.serial': oldOrder.anket.education.doc.serial,
                    'anket.education.doc.number': oldOrder.anket.education.doc.number,
                    'anket.education.doc.date': oldOrder.anket.education.doc.date,
                    'anket.education.doc.organization': oldOrder.anket.education.doc.organization,
                    'anket.education.docFile': oldOrder.anket.education.docFile,

                    'anket.education.level': oldOrder.anket.education.level,
                    'anket.education.specialty': oldOrder.anket.education.specialty,
                    'anket.education.irnituEdu2020': oldOrder.anket.education.irnituEdu2020,
                })

                if (!order.anket.entrance.schoolCertificateBall)
                    order.anket.entrance.schoolCertificateBall = oldOrder.anket.entrance.schoolCertificateBall

                order.anket.entrance.specialNeeds = oldOrder.anket.entrance.specialNeeds

                //order.anket.entrance.targetHave = oldOrder.anket.entrance.targetHave
                //order.anket.entrance.targetOrganization = oldOrder.anket.entrance.targetOrganization
                //order.anket.entrance.targetDogovor = oldOrder.anket.entrance.targetDogovor

                order.anket.benefits = oldOrder.anket.benefits
                order.anket.entrance.subjects = oldOrder.anket.entrance.subjects
                order.applications = oldOrder.applications

                for (const oldAch of oldOrder.anket.entrance.achievements) {
                    let foundAch: Achievement
                    for (const newAch of order.anket.entrance.achievements) {
                        if (oldAch.achievementType === newAch.achievementType) {
                            foundAch = newAch
                        }
                    }
                    if (!foundAch) {
                        order.anket.entrance.achievements.push(oldAch)
                    } else {
                        if (oldAch.docFile)
                            foundAch.docFile = oldAch.docFile
                    }
                }

                order.send = oldOrder.send

                if (!order.cinstitute) {
                    order.cinstitute = oldOrder.cinstitute
                }

                await order.savePromise()
                return 'update'
            } else {
                return 'update_skip'
            }


        } else {
            // return 'insert-' + oldOrder.eduTypeSlug
            // return 'insert-' + oldOrder.eduTypeSlug + '-' + (haveBudget ? 'budget' : 'commerce')

            order = this.coreService.createModel({})

            order.userId = oldOrder.userId

            order.anket = oldOrder.anket
            order.applications = oldOrder.applications
            order.send = oldOrder.send

            order.regnum = oldOrder.regnum
            order.deleted = oldOrder.deleted
            order.userId = oldOrder.userId
            order.eduType = oldOrder.eduType

            order.cordersource = oldOrder.cordersource

            order.cinstitute = oldOrder.cinstitute
            order.sendDate = oldOrder.sendDate
            order.state = oldOrder.state
            order.coperator = oldOrder.coperator

            order.mail = oldOrder.mail
            order.chat = oldOrder.chat

            order.createAt = oldOrder.createAt
            order.updateAt = oldOrder.updateAt

            order.epgu = oldOrder.epgu
            order.ais = oldOrder.ais

            order.cordersource = AbitWorkplaceEnum.CIS_ABIT

            order.lk.id = oldOrder._id.toString()
            order.lk.nid = oldOrder.nid
            order.lk.createAt = oldOrder.createAt
            order.lk.updateAt = oldOrder.updateAt
            order.lk.sendDate = oldOrder.sendDate
            order.lk.portedInsert = true
            order.lk.portedStatus = oldOrder.state.status
            order.lk.portedLast = true

            await order.savePromise()
            return 'insert'
        }
    }

    async portOldOrders() {

        let oldOrders: AbitOrderOldModel[] = await this.orderOldService.model.find({
            'sendDate': {$gt: new Date(2023, 7, 14)}
            //nid: 5940
        }).exec()


        const stat = {}

        for (const oldOrder of oldOrders) {
            const res = await this.portOldOrder(oldOrder)

            if (!stat[res])
                stat[res] = 0

            stat[res]++
        }

        return stat
    }


}
