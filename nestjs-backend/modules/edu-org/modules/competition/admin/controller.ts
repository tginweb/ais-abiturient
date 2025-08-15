import {Controller, Get, Query} from '@nestjs/common'
import * as fs from 'fs'
import {InjectModel} from "nestjs-typegoose"
import {EduAisEntrantModel as Model} from "~modules/edu-org/modules/ais-entrant/model"
import {ReturnModelType} from "@typegoose/typegoose"
import {EduCompetitionService} from "~modules/edu-org/modules/competition/core/service";

const path = require('path')
const dayjs = require('dayjs')
const os = require('os');

@Controller('competition/admin')
export class EduCompetitionAdminController {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: EduCompetitionService,
    ) {

    }

    @Get('generate-competitions-nap-prior')
    async generateCompetsNapPrior(
        @Query('id') id: any,
    ): Promise<any> {

        const competitions = await this.coreService.query().where({
            clevel: {$in: [1, 2]},
            csource: {$ne: 1},
            isdop: true,
            //csource: {$in: [2,4,5]},
            //cadmission: {$in: [24298,24316]}
        }).execMany()

        const compets = []
        const apps = []

        for (const competition of competitions) {

            if (!competition.admissionNumber)
                continue;

            const ratingApps = await this.coreService.getRatingApps(competition.id, false)
            const source = await competition.getSource()

            let appsByCompet = {}

            for (const ratingApp of ratingApps) {
                if (
                    appsByCompet[ratingApp.orderUid] &&
                    (appsByCompet[ratingApp.orderUid].ball > ratingApp.ball)
                ) {
                    continue
                }
                appsByCompet[ratingApp.orderUid] = {
                    competId: competition.id,
                    nid: ratingApp.orderNid,
                    fio: ratingApp.fio,
                    original: ratingApp.podldoc,
                    ball: ratingApp.ball,
                    priority: ratingApp.priority,
                    tests: ratingApp.tests
                }
            }

            for (const app of Object.values(appsByCompet)) {
                apps.push(app)
            }

            compets.push({
                id: competition.id,
                name: competition.name,
                admissionNumber: competition.admissionNumberTotal,
                usedNumber: 0,
            })
        }

        const fileDir = process.env.NODE_ENV === 'development' ? '/Users/tgin/Documents/www/abit-russian.loc/served/ratings-nap' : '/var/www/cis.istu.edu/www/served/ratings-nap'

        {
            let fileName = 'rating-' + dayjs().format('YYYY-MM-DD-HH-mm') + '-compets.json'
            let filePath = fileDir + '/' + fileName

            await fs.promises.writeFile(filePath, compets.map(compet => {
                return [
                    compet.name,
                    compet.id,
                    compet.admissionNumber,
                    compet.usedNumber,
                ].join("\t")
            }).join(os.EOL))
        }

        {
            let fileName = 'rating-' + dayjs().format('YYYY-MM-DD-HH-mm') + '-abit.json'
            let filePath = fileDir + '/' + fileName

            await fs.promises.writeFile(filePath, apps.map(app => {

                let subjs = app.tests.map(test => test.ball)

                return [
                    app.fio,
                    app.original ? '1' : '0',
                    app.nid,
                    app.competId,
                    app.ball,
                    app.priority,
                    ...subjs
                ].join("\t")
            }).join(os.EOL))

        }


        return {'ok': 1}
    }

    @Get('generate-competitions-nap-budget')
    async generateCompetsNapBudget(
        @Query('id') id: any,
    ): Promise<any> {

        const competitions = await this.coreService.query().where({
            //clevel: {$in: [1, 2]},
            csource: {$in: [1]},
            isdop: true,
            //csource: {$in: [2,4,5]},
            //cadmission: {$in: [24298,24316]}
        }).execMany()

        const compets = []
        const apps = []

        for (const competition of competitions) {

            if (competition.csource !== 1)
                continue;

            const ratingApps = await this.coreService.getRatingApps(competition.id, false, true)

            let appsByCompet = {}

            for (const ratingApp of ratingApps) {
                if (
                    appsByCompet[ratingApp.orderUid] &&
                    (appsByCompet[ratingApp.orderUid].ball > ratingApp.ball)
                ) {
                    continue
                }
                appsByCompet[ratingApp.orderUid] = {
                    competId: competition.id,
                    nid: ratingApp.orderNid,
                    fio: ratingApp.fio,
                    original: ratingApp.podldoc,
                    ball: ratingApp.ball,
                    priority: ratingApp.priority,
                    tests: ratingApp.tests,
                    snils: ratingApp.snils,
                }
            }

            for (const app of Object.values(appsByCompet)) {
                apps.push(app)
            }

            compets.push({
                id: competition.id,
                name: competition.name,
                //admissionNumber: competitionsPlaces[competition.cadmission],
                admissionNumber: competition.admissionNumberTotal,
                usedNumber: 0,
            })
        }

        const fileDir = process.env.NODE_ENV === 'development' ? '/Users/tgin/Documents/www/abit-russian.loc/served/ratings-nap' : '/var/www/cis.istu.edu/www/served/ratings-nap'

        {
            let fileName = 'rating-' + dayjs().format('YYYY-MM-DD-HH-mm') + '-compets.json'
            let filePath = fileDir + '/' + fileName

            await fs.promises.writeFile(filePath, compets.map(compet => {
                return [
                    compet.name,
                    compet.id,
                    compet.admissionNumber,
                    compet.usedNumber,
                ].join("\t")
            }).join(os.EOL))
        }

        {
            let fileName = 'rating-' + dayjs().format('YYYY-MM-DD-HH-mm') + '-abit.json'
            let filePath = fileDir + '/' + fileName

            await fs.promises.writeFile(filePath, apps.map(app => {

                let subjs = app.tests.map(test => test.ball)

                return [
                    app.fio + ' ' + (app.snils ? 'СНИЛС ' + app.snils : '№ ' + app.nid),
                    app.original ? '1' : '0',
                    app.nid,
                    app.competId,
                    app.ball.toString().replace('.', ','),
                    app.priority,
                    ...subjs
                ].join("\t")
            }).join(os.EOL))

        }


        return {'ok': 1}
    }

    @Get('generate-decree')
    async generateDecree(
        @Query('id') id: any,
    ): Promise<any> {

        const competitions = await this.coreService.query().where({
            //clevel: {$in: [1,2]},
            //csource: {$nin: [3,6]},
            //isdop: true,
            //csource: {$in: [2,4,5]},
            //cadmission: {$in: [24298,24316]}
        }).withViewPublic().execMany()

        const compets = []
        const apps = []

        for (const competition of competitions) {

            const ratingApps = await this.coreService.getInOrderApps(competition.id, false)

            for (const ratingApp of ratingApps) {

                apps.push({
                    orderTypeName: ratingApp.orderTypeName,
                    competId: competition.id,
                    sourceName: competition.source.name,
                    nid: ratingApp.orderNid,
                    fio: ratingApp.fio,
                    original: ratingApp.podldoc,
                    ball: ratingApp.ball,
                    achievementBall: ratingApp.achievementBall,
                    priority: ratingApp.priority,
                    tests: ratingApp.tests,
                    snils: ratingApp.snils,
                    directName: competition.admission.direct_name || competition.admission.spec_name,
                    fobName: ratingApp.fobName,
                    //directOkso: competition.admission.direction.cod,
                    facName: competition.admission.fac.name,
                    isSpo: ratingApp.isSpo
                })
            }

        }

        const fileDir = process.env.NODE_ENV === 'development' ? '/Users/tgin/Documents/www/abit-russian.loc/served/decree' : '/var/www/cis.istu.edu/www/served/decree'

        {
            let fileName = 'rating-' + dayjs().format('YYYY-MM-DD-HH-mm') + '-abit.json'
            let filePath = fileDir + '/' + fileName

            const lines = []


            for (const app of apps) {
                for (const test of app.tests) {

                    const line = [
                        app.orderTypeName,
                        app.nid,
                        app.fio,
                        app.directName,
                        app.fobName,
                        //app.directOkso,
                        app.sourceName,
                        test.subjectName,
                        test.passingTypeName,
                        '_' + test.ball
                    ]

                    lines.push(line.join(';'))
                }
            }


            /*

            for (const app of apps) {

                let egeBall = 0
                let internalBall = 0

                for (const test of app.tests) {
                    if (test.passingType === 'ege') {
                        egeBall += test.ball
                    } else {
                        internalBall += test.ball
                    }
                }

                const line = [
                    app.nid,
                    app.fio,
                    app.directName,
                    //app.directOkso,
                    app.fobName,
                    app.sourceName,
                    app.ball,
                    app.achievementBall,
                    egeBall,
                    internalBall,
                    app.isSpo ? 'да' : ''
                ]

                lines.push(line.join(';'))
            }

             */

            await fs.promises.writeFile(filePath, lines.join(os.EOL))

        }


        return {'ok': 1}
    }


    @Get('generate-competitions')
    async generateCompets(
        @Query('id') id: any,
    ): Promise<any> {

        const competitions = await this.coreService.query().where({
            //id: 848
            //cadmission: {$in: [24182]}
        }).sort({isdop: -1}).execMany()

        const res = {}

        for (const competition of competitions) {

            switch (competition.clevel) {
                case 1:
                case 2:
                case 3: // МАГ
                case 4: // СПО
                case 5: // АСП
                    if (competition.csource !==3)
                        continue;
                    break;
            }

            if (!res[competition.cadmission])
                res[competition.cadmission] = []

            const ratingApps = await this.coreService.getRatingApps(competition.id, false)
            const source = await competition.getSource()

            res[competition.cadmission].push({
                id: competition.id,
                name: competition.name,
                sourceName: source.name,
                celevOrgName: competition.celevOrgName,
                admissionNumber: competition.admissionNumberTotal,
                finished: competition.isFinished,
                ratingApps: ratingApps
            })
        }

        const fileDir = process.env.NODE_ENV === 'development' ? '/Users/tgin/Documents/www/abit-russian.loc/served/ratings-json-res' : '/var/www/cis.istu.edu/www/served/ratings-json-res'

        const fileName = 'rating-' + dayjs().format('YYYY-MM-DD-HH-mm') + '.json'

        const filePath = fileDir + '/' + fileName

        await fs.promises.writeFile(filePath, JSON.stringify(res))

        await fs.promises.writeFile(fileDir + '/curr-test.txt', fileName)

        return {'ok': 1}
    }


    @Get('generate-competitions-epgu')
    async generateCompetsEpgu(
        @Query('id') id: any,
    ): Promise<any> {

        let fileDir = process.env.NODE_ENV === 'development' ? '/Users/tgin/Documents/www/abit-russian.loc/served/ratings-epgu' : '/var/www/cis.istu.edu/www/served/ratings-epgu'

        fileDir = fileDir + '/' + dayjs().format('YYYY-MM-DD-HH-mm')

        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, {recursive: true});
        }

        const competitions = await this.coreService.query().where({
            clevel: {$in: [1, 2]},
            csource: {$in: [1]},
            cadmission: 24180
        }).execMany()


        for (const competition of competitions) {
            const res = []

            const ratingApps = await this.coreService.getRatingApps(competition.id, false)
            const source = await competition.getSource()

            res.push({
                id: competition.id,
                name: competition.name,
                sourceName: source.name,
                celevOrgName: competition.celevOrgName,
                admissionNumber: competition.admissionNumberTotal,
                finished: competition.isFinished,
                ratingApps: ratingApps
            })

            let fileName = competition.cadmission + '.' + competition.csource + '.json'

            let filePath = fileDir + '/' + fileName

            await fs.promises.writeFile(filePath, JSON.stringify(res))
        }


        return {'ok': 1}
    }

}
