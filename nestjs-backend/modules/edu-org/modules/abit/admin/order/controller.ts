import {Controller, forwardRef, Get, Inject} from '@nestjs/common';
import {AbitOrderService} from "../../core/order/service";
import * as fs from "fs";
import {FileService} from "~modules/file/core/service";
import {AbitOrderAdminService as ModelAdminService} from "./service";
import {promisify} from "util";
import parseCsvFile from "~lib/util/data/parseCsvFile";
import {EduAisEntrantService} from "~modules/edu-org/modules/ais-entrant/service";
import {AbitOrderModel, AbitOrderOldService} from "~modules/edu-org/modules/abit/core/order";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app";
import {EduCompetitionService} from "~modules/edu-org/modules/competition/core/service";
import {EduAdmissionAdminService} from "~modules/edu-org/modules/admission/admin/service";
import {EduDirectionAdminService} from "~modules/edu-org/modules/direction/admin";

const readFile = promisify(fs.readFile)

const path = require('path')
const mime = require('mime')

@Controller('abit/order/admin')
export class AbitOrderAdminController {
    constructor(
        private readonly orderService: AbitOrderService,
        private readonly fileService: FileService,
        private readonly modelAdminService: ModelAdminService,
        @Inject(forwardRef(() => EduAisEntrantService))
        private readonly aisEntrantService: EduAisEntrantService,
        private readonly oldOrderService: AbitOrderOldService,
        private readonly competitionService: EduCompetitionService,
        private readonly admissionAdminService: EduAdmissionAdminService,
        private readonly directionAdminService: EduDirectionAdminService
    ) {

    }

    @Get('prezach-report')
    async prezachReport() {

        const orders = await this.orderService.query().where({prezachCompetitionId: {$gt: 0}}).execMany()

        const inOrders = ``

        const inOrdersLines = inOrders.split("\n")

        const inOrderAppGuids = {}

        for (const line of inOrdersLines) {
            const [appGuid, compet, status] = line.split(';')
            inOrderAppGuids[appGuid] = appGuid
        }

        const lines = []

        for (const order of orders) {

            const zachCompet = await this.competitionService.query().where({id: order.prezachCompetitionId}).execOne()

            const adm = await zachCompet.getAdmission()

            let foundInOrder

            for (const appGroup of await order.getAppGroups()) {

                if (appGroup.epguGuid || true) {

                    /*
                    if (inOrderAppGuids[appGroup.epguGuid]) {
                        foundInOrder = true
                        continue;
                    }

                     */

                    const apps = await appGroup.getActiveAppsCollection()

                    for (const app of apps.all()) {
                        if (!app.isBudget && (app.statusId === AppStatusEnum.INORDER)) {
                            if (app.competitionId === zachCompet.id) {
                                lines.push(adm.direct_name + ';' + (order.snilsReal || order.nid) + ';' + appGroup.epguGuid + ';' + zachCompet.uid)
                                //lines.push(appGroup.epguGuid + ';' + zachCompet.uid)
                            }
                        }
                    }

                }
            }


            /*
            if (!foundInOrder) {
                lines.push([
                    adm.fac['name'],
                    order.nid,
                    order.fio,
                    order.snilsReal,
                    order.passport,
                    adm.direct_name,
                    adm.abbr
                ].join(';'))
            }
             */

        }

        return lines.join("\n")
    }

    @Get('nap-import-results')
    async napImportResults() {

        let rows = await parseCsvFile(path.join(process.cwd(), 'import/nap-res.csv'), null, ';')
        let resStat = {}

        for (const row of rows) {

            if (!row.orderNid)
                continue;

            const order = await this.orderService.query().where({nid: row.orderNid}).execOne()

            if (order) {

                if (order.zachCompetitionId)
                    continue;

                const apps = await order.getAppsCollection()
                const appsActive = apps.getActiveItems()

                const app = appsActive.findByCompetitionId(parseInt(row.competId))

                if (app) {
                    if (app.statusId === AppStatusEnum.COMPET_MEMBER) {
                        if (!order.prezachCompetitionId || (order.prezachCompetitionId !== app.competitionId)) {
                            order.prezachCompetitionId = app.competitionId
                            order.prezachStatus = null
                        }
                        await order.savePromise()
                    }
                }
            }
        }

        return {
            //orders: ordersRes,
            //aisEntrants: aisEntrantsRes,
            //lk: lkOrdersRes,
        }
    }

    @Get('generateSverka')
    async generateSverka() {

        // CIS

        const orders = await this.orderService.query().where({eduType: 2}).limit(100000).withRequired().execMany()

        const ordersRes = []

        let ind = 0

        for (const order of orders) {

            const appGroups = []

            if (order.appGroups) {
                for (const appGroup of (await order.getAppGroups())) {
                    const appGroupRes = {
                        isBudget: appGroup.isBudget,
                        appsActive: (await appGroup.getActiveAppsCollection()).all().map(app => ({
                            id: app.id,
                            statusTitle: app.statusTitle,
                            statusColor: app.status ? app.status.color : null,
                            priority: app.priority,
                            priorityTarget: app.priorityTarget,
                            competitionId: app.competitionId,
                            competitionUid: app.competitionUid,
                            competition: {
                                name: app.competition.name,
                                celevOrgName: app.competition.celevOrgName,
                                admission: {
                                    name: app.competition.admission.name
                                },
                                source: {
                                    name: app.competition.source.name,
                                }
                            }
                        }))
                    }
                    appGroups.push(appGroupRes)
                }
            }

            const orderRes = {
                id: order.id,
                nid: order.nid,
                uid: order.uid,
                lastName: (order.anket.personal.lastName || '').trim().toUpperCase(),
                eduType: order.eduType,
                fio: order.fio.toUpperCase(),
                snils: order.snilsReal,
                passport: order.passportReal,
                appGroups: appGroups,
                statusName: order.statusName,
                ais: order.ais,
                podldocAny: order.podldocAny,
                tests: (await order.getTests()).filter(test => !!test.ball).map(test => ({
                    csubject: test.csubject,
                    subjectName: test.subject.name,
                    passingType: test.passingType,
                    ball: test.ball,
                })),
                achievements: order.anket.entrance.achievements || [],
            }

            ordersRes.push(orderRes)
        }

        // OLD LK

        const lkOrders = await this.oldOrderService.model.find({eduType: 2})

        const lkOrdersRes = []

        for (const order of lkOrders) {

            const orderRes = {
                nid: order.nid,
                uid: order.uid,
                lastName: (order.anket.personal.lastName || '').trim().toUpperCase(),
                eduType: order.eduType,
                fio: order.fio.toUpperCase(),
                snils: order.snilsReal,
                passport: order.passportReal,
                apps: order.applications,
                ais: order.ais
            }

            lkOrdersRes.push(orderRes)
        }


        // AIS

        const aisEntrantsRes = []

        const aisEntrants = await this.aisEntrantService.query()
            .withViewPublic()
            .limit(100000)
            .where({
                state: {$in: [1, 2]},
                eduType: 2
            })
            .execMany()

        for (const aisEntrant of aisEntrants) {
            const aisEntrantRes = {
                nid: aisEntrant.id,
                uid: aisEntrant.uid,
                lastName: (aisEntrant.lastName || '').trim().toUpperCase(),
                snils: aisEntrant.snilsReal,
                passport: aisEntrant.passportReal,
                fio: aisEntrant.fio.toUpperCase(),
                apps: aisEntrant.apps
            }
            aisEntrantsRes.push(aisEntrantRes)
        }

        const filePath = path.join(process.cwd(), '/sverka.json')

        await fs.promises.writeFile(filePath, JSON.stringify({
            orders: ordersRes,
            aisEntrants: aisEntrantsRes,
            lk: lkOrdersRes,
        }))

        return {
            orders: ordersRes,
            aisEntrants: aisEntrantsRes,
            lk: lkOrdersRes,
        }
    }

    @Get('import-marks-asp')
    async importMarksAsp() {

        let rows = await parseCsvFile(path.join(process.cwd(), 'import/res_asp.csv'), null, ';')
        let resStat = {}

        for (const row of rows) {
            const res = await this.orderService.importMarkAsp(row)
            if (!resStat[res])
                resStat[res] = 0
            resStat[res]++
        }

        return resStat
    }

    @Get('import-marks-mag')
    async importMarksMag() {

        let rows = await parseCsvFile(path.join(process.cwd(), 'import/res_mag.csv'), null, ';')
        let resStat = {}

        for (const row of rows) {
            const res = await this.orderService.importMarkMag(row)
            if (!resStat[res])
                resStat[res] = 0
            resStat[res]++
        }

        return resStat
    }

    @Get('import-marks-moodle-new')
    async importMarksMoodle() {

        let rows = await parseCsvFile(path.join(process.cwd(), 'import/res_moodle.csv'), null, ';')

        rows = rows.filter(row => {
            return parseInt(row['Оценка'])
        })

        let resStat = {}

        console.log(rows.length, 'TOTAL COUNT')

        for (const row of rows) {
            const res = await this.orderService.importMarkMoodleNew(row)
            if (!resStat[res])
                resStat[res] = 0

            resStat[res]++
        }

        console.log(resStat)

        return resStat
    }

    @Get('adm-sync-ais')
    async syncWithAis() {

        const stat = await this.admissionAdminService.syncWithAis()

        return {
            synced: true
        }

    }

    @Get('dir-sync-ais')
    async dirWithAis() {

        const stat = await this.directionAdminService.syncWithAis()

        return {
            synced: true
        }

    }



    @Get('port-old')
    async portOld() {

        const stat = await this.modelAdminService.portOldOrders()

        return stat

    }

    @Get('fill-podl')
    async fillPodl() {

        let rows = await parseCsvFile(path.join(process.cwd(), 'import/podl.csv'), null, ';')

        let resStat = {}

        for (const row of rows) {

            const order = await this.orderService.query().where({'epgu.guid': row.entrantGuid}).execOne()

            let res

            if (order) {
                if (!row.snils || row.snils === order.snilsReal) {

                    if (!order.podldocEpgu) order.podldocEpguRecieved = new Date()

                    order.podldocEpgu = true

                    await order.savePromise()
                    res = 'success'
                } else {
                    res = 'not_match'
                }
            } else {
                res = 'not_found_guid'
            }

            if (!resStat[res])
                resStat[res] = 0

            resStat[res]++
        }

        return resStat

    }


    @Get('checkApps')
    async checkApps() {

        let apps = await parseCsvFile(path.join(process.cwd(), 'import/apps.csv'), null, ';')

        let count = 0

        let res = []

        for (const app of apps) {
            if (!app.snils)
                continue;

            let foundMember = false
            let foundCanceledApp: AbitAppModel
            let foundCanceledOrder: AbitOrderModel

            let [lastName, firstName, secondName] = app.fio.split(' ')

            let orders = await this.orderService.query().where({'anket.personal.snils': app.snils}).execMany()

            orders = orders.filter(order => {
                const equal = order.anket.personal.lastName.trim().toLowerCase() === lastName.trim().toLowerCase()

                if (!equal) {
                    console.log([order.anket.personal.lastName.trim().toLowerCase(), lastName.trim().toLowerCase()], 'NOT EQUAL FIO')
                    console.log([order.fio, app.fio], 'NOT EQUAL FIO')
                }

                return equal
            })

            if (!orders.length) {
                //console.log(app.fio + ';' + app.snils + ';' + app.appGuid + ';' + app.competitionUid)
                console.log(app.appGuid + ';' + app.competitionUid)
                continue;
            }


            for (const order of orders) {

                const orderApps = await order.getAppsCollection()

                for (const orderApp of orderApps.all()) {
                    if (orderApp.competitionUid === app.competitionUid) {
                        if (orderApp.statusId === AppStatusEnum.COMPET_MEMBER) {
                            foundMember = true
                        }
                        if (orderApp.isCanceled) {
                            foundCanceledApp = orderApp
                            foundCanceledOrder = order
                        }
                    }
                }
            }


            if (foundCanceledApp && !foundMember) {
                //console.log(app.fio + ';' + app.snils + ';' + app.appGuid + ';' + app.competitionUid)

                const fields = {
                    appGuid: app.appGuid,
                    competitionUid: app.competitionUid,
                    statusId: foundCanceledApp.statusId,
                    statusTitle: foundCanceledApp.statusTitle,
                    cancelReasonId: foundCanceledApp.cancelReasonId,
                    cancelReasonTitle: await foundCanceledApp.cancelReasonTitle(),
                    cancelReasonMessage: foundCanceledOrder.state.message,
                    orderNid: foundCanceledOrder.nid,
                    fio: app.fio,
                    snils: app.snils
                }

                res.push(fields)

            }
        }

        return res

    }

}
