import {BadRequestException, forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitOrderModel, AbitOrderModel as Model} from "./model";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {AbitOrderQuery as ModelQuery} from "./query";
import {EntityService} from "~modules/entity/entity.service";
import {OnEvent} from "@nestjs/event-emitter";

import {EduOrderMessageService} from "~modules/edu-org/modules/order-message/core/service";
import {UserService} from "~modules/user/core/user.service";
import {AbitOrderStatusEnum, abitOrderStatusListById} from "./statics/status";
import {MailService} from "~modules/mail/mail.service";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app/model";
import {EduAppCollection} from "~modules/edu-org/modules/abit/core/app/collection";
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app/service";
import {EpguApp} from "./subdoc/epgu";
import {FileService} from "~modules/file/core/service";
import {CoreService} from "~modules/core/core.service";
import {UserModel} from "~modules/user/core/model/user.model";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {EduCompetitionService} from "~modules/edu-org/modules/competition/core/service";
import {AbitAppGroupModel} from "~modules/edu-org/modules/abit/core/app-group/model";
import {AbitAppGroupService} from "~modules/edu-org/modules/abit/core/app-group/service";
import {AbitTestService} from "~modules/edu-org/modules/abit/core/test/service";
import {EduDocService} from "~modules/edu-org/modules/doc/core/service";
import {EduAchievementItemService} from "~modules/edu-org/modules/achievement/core/item/service";
import {EduDocRolesList} from "~modules/edu-org/modules/doc/core/enum";
import {EduAisEntrantModel} from "~modules/edu-org/modules/ais-entrant/model";
import {AisCompetitionGroup} from "~modules/edu-org/modules/ais-entrant/subdoc/all";
import {EduSSAppModel, EpguCompetitionGroup} from "~modules/edu-org/modules/ss-app/core/model";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core/model";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {EduEpguDictionaryService} from "~modules/edu-org/modules/epgu-dictionary/core/service";
import {EduSubjectModel, EduSubjectService} from "~modules/edu-org/modules/subject/core";
import {AbitTestPassingTypeEnum} from "~modules/edu-org/modules/abit/core/test/enum";
import {EduCountryService} from "~modules/edu-org/modules/country/core/service";
import {EduSSEntrantService} from "~modules/edu-org/modules/ss-entrant/core/service";

const dayjs = require('dayjs')

export type TOrderPassport = {
    serial: string
    number: string
    firstName: string
    lastName: string
    secondName: string
    id: string
    orderId: string
    orderNid: number
}

@Injectable()
export class AbitOrderService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,
        private aisService: EduAisService,
        private eduOrderMessageService: EduOrderMessageService,
        private userService: UserService,
        private mailService: MailService,
        @Inject(forwardRef(() => EduCompetitionService))
        public competitionService: EduCompetitionService,
        public abitTestService: AbitTestService,
        @Inject(forwardRef(() => AbitAppGroupService))
        public appGroupService: AbitAppGroupService,
        @Inject(forwardRef(() => AbitAppService))
        public abitAppService: AbitAppService,
        @Inject(forwardRef(() => FileService))
        public fileService: FileService,
        @Inject(forwardRef(() => EduDocService))
        public eduDocService: EduDocService,
        @Inject(forwardRef(() => EduAchievementItemService))
        public eduAchievementItemService: EduAchievementItemService,
        private systemCoreService: CoreService,
        private admissionService: EduAdmissionService,
        public epguDictionaryService: EduEpguDictionaryService,
        public eduSubjectService: EduSubjectService,
        public eduCountryService: EduCountryService,

        @Inject(forwardRef(() => EduSSEntrantService))
        public ssEntrantService: EduSSEntrantService,
    ) {


        //this.systemCoreService.hooks.addAction('user:recalc', 'user', this.)

        this.entityService.registerEntityType('edu_order', {
            label: '',
            query: this.query.bind(this),
            create: this.createModel.bind(this),
            service: this,
        })
    }

    async findOrderApps(order): Promise<EduAppCollection> {
        return new EduAppCollection(await this.abitAppService.query().where({orderId: order._id}))
    }

    async loadAppOrder(app) {
        return this.abitAppService.query().where({_id: app.orderId})
    }

    async recalculateAppRelated(app) {

        const order = await this.loadAppOrder(app)

        const apps = this.findOrderApps(order)

        //order.appsHash = apps.getHash()
        //order.ais.appsHash = apps.getAisHash()
        //order.apgu.appsHash = apps.getEpguHash()
    }

    @OnEvent('user:recalc')
    async onUserRecalc(user: UserModel): Promise<any> {
        user.abitOrdersCount = await this.query().where({userId: user._id}).getCount()
    }

    @OnEvent('order_event')
    async onOrderEvent(order: any, eventType: string, eventData: any = {}): Promise<any> {


        let sendLog = false, logMessage: any = {},
            sendNotify = false, notifyMessage: any = {}

        switch (eventType) {

            case 'status_change':

                let statusInfo = abitOrderStatusListById[eventData.data.status];

                if (statusInfo) {

                    if (eventData.notify !== false) {
                        sendNotify = true
                        notifyMessage.title = '<span style="font-weight: normal;">Новый статус вашего заявления:</span><br><b>' + statusInfo.titleClient + '</b>'
                        notifyMessage.text = eventData.data.message
                    }

                    sendLog = true;
                    logMessage.title = 'Новый статус заявления. ' + statusInfo.titleAdmin
                    logMessage.text = eventData.data.message
                }

                break;

            case 'connect_to_user':

                if (eventData.notify !== false) {
                    sendNotify = true
                    notifyMessage.title = '<span style="font-weight: normal;">Найдено заявление по вашему адресу E-mail:</span>'
                    notifyMessage.text = 'Заявление привязно к вашей учетной записи'
                }

                break;
        }

        if (sendNotify) {

            await this.eduOrderMessageService.sendSystemMessage(
                order._id,
                eventData.creatorUserId,
                order.userId,
                notifyMessage,
                {creatorUserId: eventData.creatorUserId}
            );
        }

        /*
        if (sendLog) {
            await this.orderLogService.addEvent(
                order._id,
                eventType,
                logMessage,
                eventData.data,
                eventData.creatorUserId
            );
        }

         */
    }

    @OnEvent('message-publish')
    async onMessagePublish(message: any): Promise<any> {

        const order = await this.model.findOne({_id: message.orderId});

        const messages = await this.eduOrderMessageService.getMessagesByOrder(message.orderId);

        order.updateChatStat(messages)

        if (!order.userId) {
            const user = await this.userService.findOne({_id: order.userId})

            if (user) {
                if (message.senderType == 'company' || message.senderType == 'system') {
                    this.mailService.sendNotify(user, message, {})
                }
            }
        }

        try {
            await order.savePromise();
        } catch (e) {
            console.log(e)
        }
    }

    modelContext(): any {
        return {
            service: this
        }
    }


    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.modelContext()).where({deleted: {$ne: true}})
    }

    createModel<T>(data: any): Model {
        return new this.model(data)
    }

    async findDuplicate(data): Promise<AbitOrderModel> {

        const filtersOr = []

        if (data.by === 'snils') {
            filtersOr.push({
                'anket.personal.snils': data.snils
            })
        } else if (data.by === 'passport') {
            filtersOr.push({
                'anket.personal.doc.serial': data.passportSerial,
                'anket.personal.doc.number': data.passportNumber,
            })
        }

        return await this.model.find(filtersOr.length ? {$or: filtersOr} : {}).findOne()
    }

    appCreate(order: AbitOrderModel, appData: AbitAppModel) {
        appData.orderId = order.id
        appData.orderNid = order.nid
        return this.abitAppService.createModel(appData)
    }

    async appUpdateFromEpgu(order: AbitOrderModel, epguApp: any) {

        const apps = await order.getAppsCollection()

        //apps.findByCompetition()
    }

    async appEnsureFromEpgu(order: AbitOrderModel, uidEpgu: number, agree: boolean = null) {

        const savedApp = order.epgu.apps.find(item => item.uidEpgu === uidEpgu)

        if (!savedApp) {
            const fields: EpguApp = {
                uidEpgu: uidEpgu,
                fetched: false
            }

            if (typeof agree === 'boolean') {
                fields.agree = agree
            }

            order.epgu.apps.push(fields)
        }

        await order.savePromise()
    }

    async ensureOrderInternalDocs(order: AbitOrderModel): Promise<Boolean> {

        const docs = await order.getDocs(true)

        for (const role of EduDocRolesList) {
            if (role.internal) {

                let foundDocs = docs.filter(doc => doc.type === role.id)

                let haveDoc
                for (const foundDoc of foundDocs) {
                    if (!foundDoc.files || !foundDoc.files.length) {
                        await foundDoc.deletePromise()
                    } else {
                        haveDoc = true
                    }
                }

                if (!haveDoc) {
                    const doc = this.eduDocService.createModel({})
                    doc.orderId = order.id
                    doc.createSource = AbitWorkplaceEnum.CIS_ABIT
                    doc.type = role.id
                    await doc.savePromise()
                }
            }
        }

        return true
    }

    async addAppFromPort(order: AbitOrderModel, competitionId: number, priority?: number): Promise<AbitAppModel | false> {

        const competition = await this.competitionService.query().getByIdOrNid(competitionId)
        competition.addContext(this.competitionService.modelContext())

        if (!competition)
            return false;

        competition.addContext(this.competitionService.modelContext())

        const admission = await competition.getAdmission()
        const source = await competition.getSource()

        if (!admission || !source) {
            throw new BadRequestException('Неверный ввод')
        }

        const appGroup = await order.ensureAppGroup(source.isBudget())
        const apps = await appGroup.getActiveAppsCollection()

        let statusId: AppStatusEnum

        const orderStatus = order.lk.portedStatus || order.state.status

        switch (orderStatus) {
            case AbitOrderStatusEnum.DRAFT:
                statusId = AppStatusEnum.NEW
                break;
            case AbitOrderStatusEnum.SENDED:
                if (order.cinstitute) {
                    statusId = AppStatusEnum.COMPET_MEMBER
                } else {
                    statusId = AppStatusEnum.PENDING
                }
                break;
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
            case AbitOrderStatusEnum.CANCELED:
            case AbitOrderStatusEnum.CANCELED_ORG:
            case AbitOrderStatusEnum.DUPLICATE:
                statusId = AppStatusEnum.NEW
                break;
        }

        const newApp = this.abitAppService.createModel(<AbitAppModel>{
            ...competition.getAppFields(),
            createSource: AbitWorkplaceEnum.CIS_ABIT,
            statusId: statusId
        })

        newApp.addContext(this.abitAppService.modelContext())

        newApp.priority = priority

        newApp.lk.priority = priority
        newApp.lk.statusId = statusId

        await apps.addItem(newApp)
        await apps.save()

        return newApp
    }


    async addApp(
        order: AbitOrderModel,
        competition: EduCompetitionModel,
        appGroup: AbitAppGroupModel,
        appCreateFields: Partial<AbitAppModel>,
        appUpdateFields: Partial<AbitAppModel>,
    ): Promise<AbitAppModel | false> {

        const admission = await competition.getAdmission()
        const source = await competition.getSource()

        if (!admission || !source) {
            throw new BadRequestException('Неверный ввод')
        }

        const apps = await appGroup.getActiveAppsCollection()

        let app = apps.findByCompetitionId(competition.id)

        if (!app) {
            app = this.abitAppService.createModel(<AbitAppModel>{
                ...competition.getAppFields(),
                ...appCreateFields
            })
            await apps.addItem(app)
        }

        app.addContext(this.abitAppService.modelContext())

        if (appUpdateFields.priority)
            app.priority = appUpdateFields.priority

        if (appUpdateFields.priorityTarget)
            app.priorityTarget = appUpdateFields.priorityTarget

        if (appUpdateFields.statusId)
            app.statusId = appUpdateFields.statusId

        await app.savePromise()

        return app
    }

    async addAppFromEpgu(
        order: AbitOrderModel,
        competitionGroup: EpguCompetitionGroup,
        epguApp: EduSSAppModel
    ): Promise<AbitAppModel | false> {

        const competition = await this.competitionService.query().where({uid: competitionGroup.competitionUid}).execOne()

        if (!competition)
            return false;

        competition.addContext(this.competitionService.modelContext())

        const source = await competition.getSource()

        let statusId = competitionGroup.statusId

        if (
            statusId === AppStatusEnum.PENDING ||
            statusId === AppStatusEnum.RECEIVED ||
            statusId === AppStatusEnum.NEW
        ) {
            if (source.id === 1 || source.id === 3) {
                statusId = AppStatusEnum.COMPET_MEMBER
            }
        }

        const appGroup = await order.ensureAppGroupByEpguApp(epguApp)

        const priority = competitionGroup.priorityOther ? competitionGroup.priorityOther : competitionGroup.priorityTarget

        const app = await this.addApp(
            order,
            competition,
            appGroup,
            {
                createSource: AbitWorkplaceEnum.EPGU
            },
            {
                priority: priority,
                priorityTarget: competitionGroup.priorityTarget,
                statusId: statusId
            }
        )

        if (app) {
            app.epgu.appGuid = epguApp.guid
            app.epgu.priorityOther = competitionGroup.priorityOther
            app.epgu.priorityTarget = competitionGroup.priorityTarget
            app.epgu.statusId = competitionGroup.statusId
            await app.savePromise()
        }
    }

    async addAppFromAis(
        order: AbitOrderModel,
        competitionGroup: AisCompetitionGroup,
        priority: number,
        aisEntrant: EduAisEntrantModel
    ): Promise<AbitAppModel | false> {

        const competition = await this.competitionService.query().where({uid: competitionGroup.competitionUid}).execOne()

        if (!competition)
            return false;

        competition.addContext(this.competitionService.modelContext())

        const appGroup = await order.ensureAppGroup(competitionGroup.isBudget)

        const app = await this.addApp(
            order,
            competition,
            appGroup,
            {
                createSource: AbitWorkplaceEnum.AIS,
                registerAt: order.ais.registerAt
            },
            {
                priority: priority,
                priorityTarget: null,
                statusId: competitionGroup.statusId
            }
        )

        if (app) {
            app.ais.id = aisEntrant.id
            app.ais.cstudstate = aisEntrant.state
            app.ais.priority = priority
            app.ais.realPriority = competitionGroup.priority
            app.ais.statusId = competitionGroup.statusId
            await app.savePromise()
        }

    }

    async addAppFromAdmin(
        order: AbitOrderModel,
        competitionId: number,
        user
    ): Promise<AbitAppModel | Boolean> {

        const competition = await this.competitionService.query().getByIdOrNid(competitionId)
        competition.addContext(this.competitionService.modelContext())

        const admission = await competition.getAdmission()
        const source = await competition.getSource()

        if (!admission || !source) {
            throw new BadRequestException('Неверный ввод')
        }

        const appGroup = await order.ensureAppGroup(source.isBudget())

        const apps = await appGroup.getActiveAppsCollection()

        //if (apps.length >= order.eduTypeAppsLimit) throw new BadRequestException('Количество заявлений превышает максимальное для данного уровня образования: ' + order.eduTypeAppsLimit)

        const newApp = this.abitAppService.createModel(<AbitAppModel>{
            ...competition.getAppFields(),
            createSource: AbitWorkplaceEnum.CIS_ADMIN,
            createUserId: user._id,
            statusId: AppStatusEnum.NEW,
        })

        if (apps.findSameApp(newApp))
            throw new BadRequestException('Заявление по данному направлению подготовки и основе обучения уже присутствует среди выбранных вами')

        newApp.addContext(this.abitAppService.modelContext())
        newApp.priority = apps.getMaxPriority() + 1

        newApp.ver = 1

        await apps.addItem(newApp)
        await apps.save()
        await order.fetchAndUpdateFirstApp()

        return true
    }

    async addAppFromPublic(
        order: AbitOrderModel,
        competitionId: number,
        user
    ): Promise<AbitAppModel | Boolean> {

        const competition = await this.competitionService.query().getByIdOrNid(competitionId)
        competition.addContext(this.competitionService.modelContext())

        const admission = await competition.getAdmission()
        const source = await competition.getSource()

        if (!admission || !source) {
            throw new BadRequestException('Неверный ввод')
        }

        const appGroup = await order.ensureAppGroup(source.isBudget())

        const apps = await appGroup.getActiveAppsCollection()

        if (apps.length >= order.eduTypeAppsLimit)
            throw new BadRequestException('Количество заявлений превышает максимальное для данного уровня образования: ' + order.eduTypeAppsLimit)

        const newApp = this.abitAppService.createModel(<AbitAppModel>{
            ...competition.getAppFields(),
            createSource: AbitWorkplaceEnum.CIS_ABIT,
            createUserId: user._id,
            statusId: AppStatusEnum.NEW,
        })

        if (apps.findSameApp(newApp))
            throw new BadRequestException('Заявление по данному направлению подготовки и основе обучения уже присутствует среди выбранных вами')

        newApp.addContext(this.abitAppService.modelContext())
        newApp.priority = apps.getMaxPriority() + 1

        await apps.addItem(newApp)
        await apps.save()
        await order.fetchAndUpdateFirstApp()

        return true
    }

    async getEgePassportsAll(): Promise<TOrderPassport[]> {
        let docs = []
        const orders = await this.query().where({eduType: 2}).execMany()

        for (const order of orders) {
            let orderDocs = await order.collectEgePassports()
            orderDocs = orderDocs.map((doc) => ({
                ...doc,
                id: [doc.serial, doc.number, doc.lastName, doc.firstName, doc.secondName].join('.'),
                orderId: order.id,
                orderNid: order.nid,
            }))
            docs = [...docs, ...orderDocs]
        }

        return docs
    }

    async ensureOrderRegnum(order: AbitOrderModel, refetch = true) {
        if (!order.regnum) {
            const appGroups = await order.getAppGroupsCollection(refetch)
            const firstApp = await appGroups.getFirstApp()
            if (firstApp)
                order.regnum = await this.getOderNextRegnum(order, firstApp.cadmission)
        }
    }

    async setOrderInstitute(
        order: AbitOrderModel,
        firstApp?: AbitAppModel,
        refetch = true,
        error = true
    ) {

        if (!firstApp) {
            const appGroups = await order.getAppGroupsCollection(refetch)
            firstApp = await appGroups.getFirstApp()
        }

        if (!firstApp) {
            if (error) {
                throw new BadRequestException('В заявлении не указаны направления подготовки')
            } else {
                return
            }
        }

        if ((order.cinstitute !== firstApp.cfac) || !order.regnum) {
            order.cinstitute = firstApp.cfac
            order.regnum = await this.getOderNextRegnum(order, firstApp.cadmission)
            return order.regnum
        }

        return false
    }

    async getOderNextRegnum(order: AbitOrderModel, cadmission: number): Promise<number> {

        const admission = await this.admissionService.query().where({id: cadmission}).execOne()

        const abitPref = admission.abitpref

        const min = parseInt(abitPref.toString() + '000')
        const max = parseInt(abitPref.toString() + '999')

        const foundMaxOrder = await this.query().where({regnum: {$gt: min, $lt: max}}).sort({regnum: -1}).execOne()

        let newRegnum

        if (foundMaxOrder) {
            newRegnum = foundMaxOrder.regnum + 1
        } else {
            newRegnum = min + 1
        }

        return newRegnum
    }

    subjectsByName = null

    async getSubjectsByName() {
        if (!this.subjectsByName) {
            this.subjectsByName = (await this.eduSubjectService.query().execMany()).reduce((map, item) => {
                map[item.name.toLowerCase()] = item
                return map
            }, {})
        }
        return this.subjectsByName
    }

    async ensureTestResult(order: AbitOrderModel, subject: EduSubjectModel, result: number) {

        let foundTest = await this.abitTestService.query().where({
            orderId: order.id,
            csubject: subject.id,
            passingType: AbitTestPassingTypeEnum.INTERNAL
        }).execOne()

        if (!foundTest) {
            foundTest = this.abitTestService.createModel({})
            foundTest.orderId = order.id
            foundTest.orderNid = order.nid
            foundTest.csubject = subject.id
            foundTest.createSource = AbitWorkplaceEnum.CIS_ADMIN
            foundTest.passingType = AbitTestPassingTypeEnum.INTERNAL
        }

        foundTest.locked = true
        foundTest.resultVerified = true

        if (!foundTest.resultBall || (foundTest.resultBall < result)) {
            //if (!foundTest.resultBall || true) {
            //if (result >= 40) {}
            foundTest.resultBall = result
        }

        await foundTest.savePromise()
    }

    async removeTestResult(order: AbitOrderModel, subject: EduSubjectModel, result: number) {

        let foundTest = await this.abitTestService.query().where({
            orderId: order.id,
            csubject: subject.id,
            passingType: AbitTestPassingTypeEnum.INTERNAL
        }).execOne()

        if (foundTest) {
            foundTest.locked = false
            foundTest.resultVerified = false
            foundTest.resultBall = null
            await foundTest.savePromise()
        }
    }

    getMoodleNormalizedSubjectName(name) {
        switch (name) {
            case 'Информатика и ИКТ':
                return 'информатика'
            case 'Английский язык (Россия)':
                return 'иностранный язык'
            case 'Таможенное дело':
                return 'творческий конкурс (ТД)'
            default:
                return name
        }
    }

    async findOrderByMoodleEmail(aisid, email): Promise<AbitOrderModel | null> {

        let order

        const query = this.query().filterActual().sort({nid: -1})

        query.where({'state.status': {$ne: 'draft'}})

        if (aisid) {
            if (aisid.match('_')) {

                const [orderYear, orderUidType, orderUidVal] = aisid.trim().split('_')

                switch (orderUidType) {
                    case 'SNILS':
                        order = await query.where({'anket.personal.snils': orderUidVal}).execOne()
                        break;
                    case 'AIS':
                        order = await query.where({'ais.aisId': orderUidVal}).execOne()
                        break;
                    case 'CIS':
                        order = await query.where({'nid': orderUidVal}).execOne()
                        break;
                }

            } else {
                const orderNid = parseInt(aisid.trim())

                if (orderNid > 1000000000) {
                    order = await query.where({'anket.personal.snils': orderNid}).execOne()
                } else if (orderNid > 2450000 && orderNid < 2460000) {
                    order = await query.where({'ais.aisId': orderNid}).execOne()
                } else if (orderNid > 1000000) {
                    order = await query.where({'regnum': orderNid}).execOne()
                } else if (orderNid > 0) {
                    order = await query.where({'nid': orderNid}).execOne()
                }
            }
        } else {
            order = await query.where({'anket.personal.email': email}).execOne()
        }


        return order
    }

    async findOrderByMoodleAisId(aisid): Promise<AbitOrderModel | null> {

        let order

        const query = this.query().filterActual().sort({nid: -1})

        query.where({'state.status': {$ne: 'draft'}})

        if (aisid.match('_')) {

            const [orderYear, orderUidType, orderUidVal] = aisid.trim().split('_')

            switch (orderUidType) {
                case 'SNILS':
                    order = await query.where({'anket.personal.snils': orderUidVal}).execOne()
                    break;
                case 'AIS':
                    order = await query.where({'ais.aisId': orderUidVal}).execOne()
                    break;
                case 'CIS':
                    order = await query.where({'nid': orderUidVal}).execOne()
                    break;
            }

        } else {
            const orderNid = parseInt(aisid.trim())

            if (orderNid > 1000000000) {
                order = await query.where({'anket.personal.snils': orderNid}).execOne()
            } else if (orderNid > 2450000 && orderNid < 2460000) {
                order = await query.where({'ais.aisId': orderNid}).execOne()
            } else if (orderNid > 1000000) {
                order = await query.where({'regnum': orderNid}).execOne()
            } else if (orderNid > 0) {
                order = await query.where({'nid': orderNid}).execOne()
            }
        }

        return order
    }

    async importMarkMoodleNew(row) {

        const subjectsByName = await this.getSubjectsByName()

        if (!row['aisid']) {
            //console.error(row, 'AIS ID not declared');
            //return
        } else {
        }

        switch (row['Курс']) {
            case 'Информатика и ИКТ':
                row['Курс'] = 'информатика'
                break;
            case 'Английский язык (Россия)':
                row['Курс'] = 'иностранный язык'
                break;
            case 'Таможенное дело':
                row['Курс'] = 'творческий конкурс (ТД)'
                break;
        }

        row['Курс'] = row['Курс'].trim().toLowerCase()

        const subject = subjectsByName[row['Курс']]

        if (subject) {

            let order: AbitOrderModel

            const fio = row['Фамилия'].trim() + ' ' + row['Имя Отчество'].trim()

            let [firstName, secondName] = row['Имя Отчество'].trim().split(/\s+/)

            firstName = firstName.trim()

            let lastName = row['Фамилия'].trim()

            const mark = parseInt(row['Оценка'].trim())

            if (!mark) {
                return 'mark_0'
            }

            order = await this.findOrderByMoodleEmail(row['aisid'], row['Почта'].trim())

            if (order) {
                //if (row['Фамилия'].trim().toLowerCase() === order.anket.personal.lastName.trim().toLowerCase()) {
                if (
                    lastName.toLowerCase() === order.anket.personal.lastName.trim().toLowerCase() &&
                    firstName.toLowerCase() === order.anket.personal.firstName.trim().toLowerCase()
                    //|| true
                ) {
                    //order.isdop = true
                    //await order.savePromise()

                    await this.ensureTestResult(order, subject, mark)
                    return 'success'
                } else {
                    console.error([fio, order.getFio(), order.nid], 'not match');
                }

            } else {
                console.error(row['username'], 'order id not found')
            }
        } else {
            console.error(row['Курс'], 'not found')
        }

        return 'not_found'
    }

    async importMarkMag(row) {

        const subjectsByName = await this.getSubjectsByName()

        if (!row['aisid']) {
            return 'no_ais_id'
        }

        const subject = subjectsByName['проф. испытание']

        let cnt = 0

        if (subject) {

            const fio = row['Фамилия'].trim() + ' ' + row['Имя Отчество'].trim()

            let [firstName, secondName] = row['Имя Отчество'].trim().split(/\s+/)

            firstName = firstName.trim()

            let lastName = row['Фамилия'].trim()

            const mark = parseInt(row['Оценка'])

            if (!mark) {
                return 'no_mark'
            }

            let order = await this.findOrderByMoodleAisId(row['aisid'])

            if (order) {
                if (
                    (
                        [105549].indexOf(order.nid) > -1
                    )
                    ||
                    (
                        //fio.trim().toLowerCase() === order.getFio().trim().toLowerCase()
                        lastName.toLowerCase() === order.anket.personal.lastName.trim().toLowerCase() &&
                        firstName.toLowerCase() === order.anket.personal.firstName.trim().toLowerCase()
                    )
                ) {
                    await this.ensureTestResult(order, subject, mark)
                    return 'success'
                } else {
                    console.log(['VEDOMOST ' + fio, order.getFio(), order.nid], 'not match');
                }
            } else {
                console.log(row['aisid'], 'not found')
            }
        } else {
            console.log(row['Курс'], 'not found')
        }
        return 'not_found'
    }

    async importMarkAsp(row) {

        const subjectsByName = await this.getSubjectsByName()

        if (!row['aisid']) {
            console.log(row)
            return 'no_ais_id'
        }

        let subject

        if ((row['Курс']||'').match('язык') || (row['Название теста']||'').match('язык')) {
            subject = subjectsByName['иностранный язык']
        } else {
            subject = subjectsByName['спец.дисциплина']
        }

        if (subject) {

            const fio = row['Фамилия'].trim() + ' ' + row['Имя Отчество'].trim()

            let [firstName, secondName] = row['Имя Отчество'].trim().split(/\s+/)

            firstName = firstName.trim()

            let lastName = row['Фамилия'].trim()

            const mark = parseInt(row['Оценка'])

            if (!mark) {
                return 'no_mark'
            }

            let order = await this.findOrderByMoodleAisId(row['aisid'])

            if (order) {
                if (
                    (
                        //fio.trim().toLowerCase() === order.getFio().trim().toLowerCase()
                        lastName.toLowerCase() === order.anket.personal.lastName.trim().toLowerCase() &&
                        firstName.toLowerCase() === order.anket.personal.firstName.trim().toLowerCase()
                    )
                ) {
                    await this.ensureTestResult(order, subject, mark)
                    return 'success'
                } else {
                    console.log(['VEDOMOST ' + fio, order.getFio(), order.nid], 'not match');
                }
            } else {
                console.log(row['aisid'], 'not found')
            }
        } else {
            console.log(row['Курс'], 'not found')
        }

        console.log(row, 'not-found')

        return 'not_found'
    }

    async updateAppFromEpgu(
        order: AbitOrderModel,
        competitionGroup: EpguCompetitionGroup,
        epguApp: EduSSAppModel
    ): Promise<AbitAppModel | false> {

        const competition = await this.competitionService.query().where({uid: competitionGroup.competitionUid}).execOne()

        if (!competition)
            return false;

        let newStatusId = competitionGroup.statusId

        const admission = await competition.getAdmission()
        const source = await competition.getSource()

        if (!admission || !source) {
            return false
        }

        const appGroup = await order.ensureAppGroupByEpguApp(epguApp)
        const appGroupApps = await appGroup.getAppsCollection()


        if (epguApp.isBudget) {

            if (competition.isdop) {

                let app = appGroupApps.findByCompetitionId(competition.id)

                if (!app) {

                    return ;

                    app = this.abitAppService.createModelWithContext(<AbitAppModel>{
                        ...competition.getAppFields(),
                        createSource: AbitWorkplaceEnum.EPGU,
                        statusId: newStatusId,
                    })

                    app.priority = competitionGroup.priority
                    app.priorityTarget = competitionGroup.priorityTarget
                    app.priorityOther = competitionGroup.priorityOther

                    app.epgu.lastNew = true

                    console.log('new app;' + order.nid)

                    await appGroupApps.addItem(app)

                } else {



                    /*
                    if (app.statusId < newStatusId) {
                        console.log('update app;' + order.nid + ';' + newStatusId)
                        app.statusId = newStatusId
                        app.epgu.statusIdUpdated = true
                    }

                    if (app.priority !== competitionGroup.priority) {
                        console.log('priority not match;' + order.nid)
                    }
                     */
                }

                app.updateSource = AbitWorkplaceEnum.EPGU
                app.epgu.appGuid = epguApp.guid
                app.epgu.priorityOther = competitionGroup.priorityOther
                app.epgu.priorityTarget = competitionGroup.priorityTarget
                app.epgu.statusId = competitionGroup.statusId

                await app.savePromise()

            } else {
                /*
                    let apps = appGroupApps.all().filter(item => item.competitionId === competition.id)

                    for (const app of apps) {

                        if (app.statusId !== newStatusId) {
                            console.log('update app;' + order.nid + ';' + newStatusId)
                            app.epgu.statusIdUpdated = true
                        }

                        if (app.priority !== competitionGroup.priority) {
                            console.log('priority not match;' + order.nid)
                        }

                        app.updateSource = AbitWorkplaceEnum.EPGU
                        app.epgu.appGuid = epguApp.guid
                        app.epgu.priorityOther = competitionGroup.priorityOther
                        app.epgu.priorityTarget = competitionGroup.priorityTarget
                        app.epgu.statusId = competitionGroup.statusId

                        await app.savePromise()
                    }
                 */
            }

        } else {

            let app = appGroupApps.findByCompetitionId(competition.id)

            if (!app) {
                app = this.abitAppService.createModelWithContext(<AbitAppModel>{
                    ...competition.getAppFields(),
                    createSource: AbitWorkplaceEnum.EPGU,
                    statusId: newStatusId,
                })

                app.priority = competitionGroup.priority
                app.priorityTarget = competitionGroup.priorityTarget
                app.priorityOther = competitionGroup.priorityOther

                app.epgu.lastNew = true

                console.log('new app;' + order.nid)

                await appGroupApps.addItem(app)

            } else {

                /*
                if (app.statusId < newStatusId) {
                    console.log('update app;' + order.nid + ';' + newStatusId)
                    app.statusId = newStatusId
                    app.epgu.statusIdUpdated = true
                }

                if (app.priority !== competitionGroup.priority) {
                    console.log('priority not match;' + order.nid)
                }
                 */
            }

            app.updateSource = AbitWorkplaceEnum.EPGU
            app.epgu.appGuid = epguApp.guid
            app.epgu.priorityOther = competitionGroup.priorityOther
            app.epgu.priorityTarget = competitionGroup.priorityTarget
            app.epgu.statusId = competitionGroup.statusId

            await app.savePromise()
        }

    }

    async updateAppFromAis(
        order: AbitOrderModel,
        competitionGroup: AisCompetitionGroup,
        priority: number,
        aisEntrant: EduAisEntrantModel,
        competition: EduCompetitionModel
    ): Promise<AbitAppModel | false> {

        //const competition = await this.competitionService.query().where({uid: competitionGroup.competitionUid}).execOne()

        if (!competition)
            return false;

        let newStatusId = competitionGroup.statusId

        const admission = await competition.getAdmission()
        const source = await competition.getSource()

        if (!admission || !source) {
            return false
        }

        const appGroup = await order.ensureAppGroup(competitionGroup.isBudget)

        const appGroupApps = await appGroup.getAppsCollection()

        let app = appGroupApps.findByCompetitionId(competition.id)

        if (!app) {
            app = this.abitAppService.createModelWithContext(<AbitAppModel>{
                ...competition.getAppFields(),
                createSource: AbitWorkplaceEnum.AIS,
                statusId: newStatusId,
            })
            app.priority = competitionGroup.priority
            await appGroupApps.addItem(app)
        } else {
            /*
            if (app.statusId < newStatusId) {
                app.statusId = newStatusId
            }
             */
        }

        app.updateSource = AbitWorkplaceEnum.AIS
        app.ais.id = aisEntrant.id
        app.ais.cstudstate = aisEntrant.state
        app.ais.priority = priority
        app.ais.realPriority = competitionGroup.priority
        app.ais.statusId = competitionGroup.statusId
        await app.savePromise()
    }

    async setEducationDocOriginalOrgFromEpgu(entrantGuid, doc) {

        if (entrantGuid && doc.OrganizationShortName) {

            let orders = await this.query().where({'epgu.guid': entrantGuid}).execMany()

            if (!orders.length) {
                const ssEntrant = await this.ssEntrantService.query().where({guid: entrantGuid}).execOne()

                if (ssEntrant.snils) {
                    orders = await this.query().where({'anket.personal.snils': ssEntrant.snils}).execMany()
                }
            }

            for (const order of orders) {

                order.podldocOrg = doc.OrganizationShortName
                order.podldocOrgTransferType = doc.IdTransferMethodOriginalDocument

                if (doc.TransferDate)
                    order.podldocOrgTransferDate = dayjs.utc(doc.TransferDate).toDate()

                if (doc.OrganizationShortName === 'ФГБОУ ВО «ИРНИТУ»') {

                    if (doc.IdTransferMethodOriginalDocument === 1) {
                        console.log('111')
                        if (!order.podldocEpgu)
                            order.podldocEpguRecieved = new Date()
                        order.podldocEpgu = true
                    }
                } else {
                    if (order.podldocEpgu)
                        order.podldocEpguCanceled = new Date()
                    order.podldocEpgu = false
                }

                await order.savePromise()
            }
        }

    }

    async setEducationDocOriginalFromEpgu(entrantGuid, status) {

        if (entrantGuid) {
            console.log(entrantGuid, status)
            const orders = await this.query().where({'epgu.guid': entrantGuid}).execMany()

            for (const order of orders) {

                if (status) {
                    if (!order.podldocEpgu)
                        order.podldocEpguRecieved = new Date()
                } else {
                    if (order.podldocEpgu)
                        order.podldocEpguCanceled = new Date()
                }

                order.podldocEpgu = status
                await order.savePromise()
            }
        }
    }

    async normalizeAppsPriorites(order: AbitOrderModel) {
        const appGroups = await order.getAppGroups()
        let index = 0
        for (const appGroup of appGroups) {
            const appsActive = await appGroup.getActiveAppsCollection()
            const appsActiveSorted = appsActive.sortByPriority()
            for (const app of appsActiveSorted.all()) {
                index++
                app.priorityNormal = index
                await app.savePromise()
            }
        }
    }

}
