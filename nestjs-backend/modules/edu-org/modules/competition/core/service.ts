import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduCompetitionModel, EduCompetitionModel as Model} from "./model";
import {EduCompetitionQuery as ModelQuery} from './query'
import {EntityService} from "~modules/entity/entity.service";
import {EduDirectionService} from "~modules/edu-org/modules/direction/core/service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {EduSourceService} from "~modules/edu-org/modules/source/core/service";
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app/service";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order/service";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {AbitTestModel} from "~modules/edu-org/modules/abit/core/test/model";
import {EduSubjectService} from "~modules/edu-org/modules/subject/core/service";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {AbitAppGroupModel} from "~modules/edu-org/modules/abit/core/app-group";
import {EduCampaignService} from "~modules/edu-org/modules/campaign/core/service";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app/model";
import {EduSubjectModel} from "~modules/edu-org/modules/subject/core";

const dayjs = require('dayjs')

@Injectable()
export class EduCompetitionService {

    public allCache = null
    public allIndexedCache = null

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,
        public serviceEduDirection: EduDirectionService,
        public serviceEduAdmission: EduAdmissionService,
        public serviceEduFob: EduSourceService,
        public serviceEduSource: EduSourceService,
        public serviceEduCampaign: EduCampaignService,
        @Inject(forwardRef(() => AbitOrderService))
        public orderService: AbitOrderService,
        @Inject(forwardRef(() => AbitAppService))
        public appService: AbitAppService,
        public subjectService: EduSubjectService,
    ) {
        this.entityService.registerEntityType('edu_competition', {
            label: '',
            find: this.find.bind(this),
            findOne: this.findOne.bind(this),
            service: this,
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

    createModel<T>(data: any): Model {
        return new this.model(data)
    }

    getQueryContext(user) {
        return {
            serviceEduDirection: this.serviceEduDirection,
            entityService: this.entityService,
            user: user
        }
    }

    modelContext(): any {
        return {
            service: this
        }
    }

    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.modelContext())
    }

    async getAllCached() {
        if (!this.allCache) {
            this.allCache = await this.query().where().exec()
        }
        return this.allCache
    }

    async getAllIndexedCached() {
        if (!this.allIndexedCache) {
            this.allIndexedCache = (await this.getAllCached()).reduce((map, item) => {
                map[item.id] = item
                return map
            }, {})
        }
        return this.allIndexedCache
    }

    async getByIdCached(id) {

        return (await this.getAllIndexedCached())[id]
    }

    async getRatingApps(competitionId, withApp = false, enoughOnly = false, withTopPriority = false, showAll = false, withInOrder = false) {

        const priemEndDates = {
            spo: {},
            bak: {
                budget: '2023-07-25',
                paid: '2023-09-25',
            },
            mag: {},
            asp: {},
        }


        const competition = await this.query().where({id: competitionId}).withViewPublic().execOne()

        if (!competition)
            return []

        const admission = await competition.getAdmission()

        //const apps = await competition.getApps()

        const appStatuses = [
            AppStatusEnum.COMPET_MEMBER
        ]

        if (withInOrder) {
            appStatuses.push(AppStatusEnum.INORDER)
        }


        const apps = await this.appService.query().withRequired().where({
            competitionId: competition.id,
            statusId: {$in: appStatuses},
        }).execMany()

        const appsOrderIds = apps.map(app => app.orderId)

        const allSubjectsById = await this.subjectService.getSubjectsById()

        const result = []

        const orders: AbitOrderModel[] = await this.orderService.query().withRequired().where({_id: {$in: appsOrderIds}}).execMany()

        const ordersById = orders.reduce((map, order) => {
            map[order.id] = order
            return map
        }, {})

        for (const app of apps) {

            //if (app.statusId !== AppStatusEnum.COMPET_MEMBER) continue;

            const order: AbitOrderModel = ordersById[app.orderId]

            if (order) {

                if (!withInOrder && order.prezachCompetitionId) {
                    continue;
                }

                let priorityIndex = 0

                if (withTopPriority) {

                    const appGroups = await order.getAppGroups()

                    let foundAppGroup: AbitAppGroupModel

                    for (const appGroup of appGroups) {
                        if (app.appGroupId === appGroup.id) {
                            foundAppGroup = appGroup
                        }
                    }

                    let activeAppsSorted = []

                    if (foundAppGroup) {
                        const foundActiveApps = await foundAppGroup.getActiveAppsCollection()
                        for (const foundApp of foundActiveApps.getItemsSortedByPriority()) {
                            activeAppsSorted.push(foundApp)
                        }
                    }

                    priorityIndex = activeAppsSorted.findIndex(item => item.nid === app.nid)

                    if (priorityIndex > -1) {
                        priorityIndex++
                    } else {
                        priorityIndex = 100
                    }
                }

                const priemEndDateStr = priemEndDates[order.eduTypeSlug][app.isBudget ? 'budget' : 'paid']

                let priemEndDate, priemEnd = false

                if (priemEndDateStr) {
                    priemEndDate = dayjs(priemEndDateStr, 'YYYY-MM-DD')
                    priemEnd = priemEndDate.isBefore(dayjs())
                }

                const orderTests = await order.getTests()

                let totalAchievementBall = order.anket.entrance.achievements.reduce((acc, item) => {
                    if (item.ball)
                        acc += item.ball
                    return acc
                }, 0)

                if (totalAchievementBall > order.eduTypeAchievementsMarkLimit) {
                    totalAchievementBall = order.eduTypeAchievementsMarkLimit
                }

                const subjectsByPriority = admission.getSubjectsByPriority()
                const subjectsByPriorityResult: Record<number, { test: AbitTestModel, minimalReached: boolean }> = {}

                let enoughTests = true

                const subjectMarks = {}

                for (let [priority, subjects] of Object.entries(subjectsByPriority)) {

                    let haveGoodTest = false

                    for (const subject of subjects) {

                        orderTests.forEach((orderTest) => {

                            if (
                                (
                                    (orderTest.csubject === subject.csubject) ||
                                    (subject.csubject === 17 && orderTest.csubject === 37)
                                )
                            ) {
                                const ball = orderTest.ball

                                if (ball) {

                                    const minimalReached = ball >= subject.minimal

                                    if (minimalReached)
                                        haveGoodTest = true

                                    if (
                                        !subjectsByPriorityResult[priority] ||
                                        (minimalReached && (subjectsByPriorityResult[priority].test.ball < orderTest.ball))
                                    ) {
                                        subjectsByPriorityResult[priority] = {
                                            minimalReached: minimalReached,
                                            test: orderTest
                                        }
                                    }
                                }
                            }
                        })
                    }

                    if (!haveGoodTest) {
                        enoughTests = false
                    }
                }

                //if (!enoughTests) continue;

                if (enoughOnly) {
                    if (!enoughTests) continue;
                } else if (!showAll) {
                    if (!enoughTests && priemEnd && (!competition.isdop)) continue;
                }

                const testsResult = []

                let ballSumm = 0, ballEntrance = 0

                ballSumm += totalAchievementBall

                for (let [priority, testData] of Object.entries(subjectsByPriorityResult)) {

                    const test = testData.test

                    if (test) {

                        ballEntrance += test.ball
                        ballSumm += test.ball

                        testsResult.push({
                            subjectName: allSubjectsById[test.csubject] ? allSubjectsById[test.csubject].name : '',
                            ball: test.ball,
                            minimalReached: testData.minimalReached
                        })
                    }
                }

                let ratingId

                const hideSnils = app.csource === 5

                if (!hideSnils && order.snilsReal) {
                    ratingId = 'СНИЛС ' + order.snilsReal
                } else {
                    ratingId = 'ID ' + [order.ais.aisId, order.nid].filter(item => !!item).join(' / ')
                }

                if (app.bvi) {
                    ballSumm = ballSumm + 1000
                }

                if (ballSumm < 120) {
                    // ballSumm = 120 + Math.floor(Math.random() * 20);
                }

                result.push({
                    priorityIndex: priorityIndex,
                    priorityTop: priorityIndex === 1,
                    entrantEpguGuid: order.epgu.guid,
                    appEpguGuid: app.epgu.appGuid,
                    bvi: app.bvi,
                    app: withApp ? app : null,
                    order: withApp ? order : null,
                    orderId: order.id,
                    orderNid: order.nid,
                    orderUid: order.uid,
                    aisId: order.ais.aisId,
                    ratingId: ratingId,
                    snils: order.snilsReal,
                    hideSnils: hideSnils,
                    fio: order.fio,
                    podldoc: order.podldocAny,
                    priority: app.priority,
                    tests: testsResult,
                    enoughTests: enoughTests,
                    ball: ballSumm,
                    ballEntrance: ballEntrance,
                    achievementBall: totalAchievementBall
                })
            }
        }

        result.sort((a, b) => ((a.ball > b.ball) ? -1 : 1))

        return result
    }

    async getInOrderApps(competitionId, withApp = false) {

        const priemEndDates = {
            spo: {},
            bak: {
                budget: '2023-07-25',
                paid: '2023-09-25',
            },
            mag: {},
            asp: {},
        }


        const competition = await this.query().where({id: competitionId}).withViewPublic().execOne()

        if (!competition)
            return []

        const admission = await competition.getAdmission()

        //const apps = await competition.getApps()

        const appStatuses = [
            AppStatusEnum.INORDER
        ]


        const apps = await this.appService.query().withRequired().where({
            competitionId: competition.id,
            statusId: {$in: appStatuses},
        }).execMany()

        const appsOrderIds = apps.map(app => app.orderId)

        const allSubjectsById = await this.subjectService.getSubjectsById()

        const result = []

        const orders: AbitOrderModel[] = await this.orderService.query().withRequired().where({_id: {$in: appsOrderIds}}).execMany()

        const ordersById = orders.reduce((map, order) => {
            map[order.id] = order
            return map
        }, {})

        for (const app of apps) {

            const order: AbitOrderModel = ordersById[app.orderId]

            if (order) {

                let priorityIndex = 0

                const orderTests = await order.getTests()

                let totalAchievementBall = order.anket.entrance.achievements.reduce((acc, item) => {
                    if (item.ball)
                        acc += item.ball
                    return acc
                }, 0)

                if (totalAchievementBall > order.eduTypeAchievementsMarkLimit) {
                    totalAchievementBall = order.eduTypeAchievementsMarkLimit
                }

                const subjectsByPriority = admission.getSubjectsByPriority()
                const subjectsByPriorityResult: Record<number, { test: AbitTestModel, minimalReached: boolean }> = {}

                let enoughTests = true

                const subjectMarks = {}

                for (let [priority, subjects] of Object.entries(subjectsByPriority)) {

                    let haveGoodTest = false

                    for (const subject of subjects) {

                        orderTests.forEach((orderTest) => {

                            if (
                                (
                                    (orderTest.csubject === subject.csubject) ||
                                    (subject.csubject === 17 && orderTest.csubject === 37)
                                )
                            ) {
                                const ball = orderTest.ball

                                if (ball) {

                                    const minimalReached = ball >= subject.minimal

                                    if (minimalReached)
                                        haveGoodTest = true

                                    if (
                                        !subjectsByPriorityResult[priority] ||
                                        (minimalReached && (subjectsByPriorityResult[priority].test.ball < orderTest.ball))
                                    ) {
                                        subjectsByPriorityResult[priority] = {
                                            minimalReached: minimalReached,
                                            test: orderTest
                                        }
                                    }
                                }
                            }
                        })
                    }

                    if (!haveGoodTest) {
                        enoughTests = false
                    }
                }


                const testsResult = []

                let ballSumm = 0, ballEntrance = 0

                ballSumm += totalAchievementBall

                for (let [priority, testData] of Object.entries(subjectsByPriorityResult)) {

                    const test = testData.test

                    if (test) {

                        ballEntrance += test.ball
                        ballSumm += test.ball

                        const subject = allSubjectsById[test.csubject]

                        testsResult.push({
                            id: subject.id,
                            isEge: subject.isEge,
                            passingType: test.passingType,
                            passingTypeName: test.passingTypeName,
                            subjectName: allSubjectsById[test.csubject] ? allSubjectsById[test.csubject].name : '',
                            ball: test.ball,
                            minimalReached: testData.minimalReached
                        })
                    }
                }

                let ratingId

                const hideSnils = app.csource === 5

                if (!hideSnils && order.snilsReal) {
                    ratingId = 'СНИЛС ' + order.snilsReal
                } else {
                    ratingId = 'ID ' + [order.ais.aisId, order.nid].filter(item => !!item).join(' / ')
                }

                if (app.bvi) {
                    //ballSumm = ballSumm + 1000
                }

                if (ballSumm < 120) {
                    // ballSumm = 120 + Math.floor(Math.random() * 20);
                }


                const eduDoc = await order.getEpguEduDoc()

                let isSpo = false

                if (eduDoc) {
                    switch (eduDoc.docTypeId) {
                        case 209010:
                            isSpo = true
                            break;
                        case 209009:
                            isSpo = true
                            break;
                        case 209069:
                            isSpo = true
                            break;
                    }
                } else {
                    console.log('edu doc not found', order.nid)
                }

                let fobName

                switch (app.cfob) {
                    case 1: fobName = 'очная'; break;
                    case 2: fobName = 'зочная'; break;
                    case 3: fobName = 'вечерняя'; break;
                }

                result.push({
                    orderTypeName: order.orderType.name,
                    isSpo: isSpo,
                    priorityIndex: priorityIndex,
                    priorityTop: priorityIndex === 1,
                    entrantEpguGuid: order.epgu.guid,
                    appEpguGuid: app.epgu.appGuid,
                    bvi: app.bvi,
                    fobName: fobName,
                    app: withApp ? app : null,
                    order: withApp ? order : null,
                    orderId: order.id,
                    orderNid: order.nid,
                    orderUid: order.uid,
                    aisId: order.ais.aisId,
                    ratingId: ratingId,
                    snils: order.snilsReal,
                    hideSnils: hideSnils,
                    fio: order.fio,
                    podldoc: order.podldocAny,
                    priority: app.priority,
                    tests: testsResult,
                    enoughTests: enoughTests,
                    ball: ballSumm,
                    ballEntrance: ballEntrance,
                    achievementBall: totalAchievementBall
                })
            }
        }

        result.sort((a, b) => ((a.ball > b.ball) ? -1 : 1))

        return result
    }

    async getInOrderAppRating(
        competition: EduCompetitionModel,
        order: AbitOrderModel,
        app: AbitAppModel
    ) {

        const admission = await competition.getAdmission()

        const allSubjectsById = await this.subjectService.getSubjectsById()

        const orderTests = await order.getTests()

        let totalAchievementBall = order.anket.entrance.achievements.reduce((acc, item) => {
            if (item.ball)
                acc += item.ball
            return acc
        }, 0)

        if (totalAchievementBall > order.eduTypeAchievementsMarkLimit) {
            totalAchievementBall = order.eduTypeAchievementsMarkLimit
        }

        const subjectsByPriority = admission.getSubjectsByPriority()

        const subjectsByPriorityResult: Record<number, {
            test: AbitTestModel,
            subject: EduSubjectModel,
            minimalReached: boolean,
            minimal: number
        }> = {}

        let enoughTests = true

        for (let [priority, subjects] of Object.entries(subjectsByPriority)) {

            let haveGoodTest = false

            for (const subject of subjects) {

                orderTests.forEach((orderTest) => {

                    if (
                        (
                            (orderTest.csubject === subject.csubject) ||
                            (subject.csubject === 17 && orderTest.csubject === 37)
                        )
                    ) {
                        const ball = orderTest.ball

                        if (ball) {

                            const minimalReached = ball >= subject.minimal

                            if (minimalReached)
                                haveGoodTest = true

                            if (
                                !subjectsByPriorityResult[priority] ||
                                (minimalReached && (subjectsByPriorityResult[priority].test.ball < orderTest.ball))
                            ) {
                                subjectsByPriorityResult[priority] = {
                                    minimal: subject.minimal,
                                    minimalReached: minimalReached,
                                    test: orderTest,
                                    subject: subject.subject
                                }
                            }
                        }
                    }
                })
            }

            if (!haveGoodTest) {
                enoughTests = false
            }
        }

        const testsResult = []

        let ballSumm = 0, ballEntrance = 0

        ballSumm += totalAchievementBall

        for (let [priority, testData] of Object.entries(subjectsByPriorityResult)) {

            const test = testData.test

            if (test) {

                ballEntrance += test.ball
                ballSumm += test.ball

                const subject = allSubjectsById[test.csubject]

                testsResult.push({
                    passingType: test.passingType,
                    passingTypeName: test.passingTypeName,
                    subjectName: subject ? subject.name : '',
                    csubject: test.csubject,
                    ball: test.ball,
                    minimalReached: testData.minimalReached,
                    minimal: testData.minimal,
                    subject: subject
                })
            }
        }

        let ratingId

        const hideSnils = app.csource === 5

        if (!hideSnils && order.snilsReal) {
            ratingId = 'СНИЛС ' + order.snilsReal
        } else {
            ratingId = 'ID ' + [order.ais.aisId, order.nid].filter(item => !!item).join(' / ')
        }

        if (app.bvi) {
            ballSumm = ballSumm + 1000
        }

        let result: any = {}

        result = {
            entrantEpguGuid: order.epgu.guid,
            appEpguGuid: app.epgu.appGuid,
            bvi: app.bvi,
            orderId: order.id,
            orderNid: order.nid,
            orderUid: order.uid,
            aisId: order.ais.aisId,
            ratingId: ratingId,
            snils: order.snilsReal,
            hideSnils: hideSnils,
            fio: order.fio,
            podldoc: order.podldocAny,
            priority: app.priority,
            tests: testsResult,
            enoughTests: enoughTests,
            ball: ballSumm,
            ballEntrance: ballEntrance,
            achievementBall: totalAchievementBall
        }

        return result
    }
}

