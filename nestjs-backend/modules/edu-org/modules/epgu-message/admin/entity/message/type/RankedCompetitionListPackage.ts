import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core";

interface DocArgs {
    snils: string
    guid: string
}

const dayjs = require('dayjs')

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})
export class RankedCompetitionListPackage extends EduEpguMessageModel {

    get epguEntityType() {
        return 'RankedCompetitionListPackage'
    }

    get epguAction() {
        return 'Add'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {

        const entity: EduCompetitionModel = await this.getArgEntity()

        const competitions = []

        const ratingApps = await this.service.competitionService.getRatingApps(entity.id, false, true, true)

        //const ratingApps = []

        let rang = 0


        const dataPackage = {
            UidCompetition: entity.uid,
            Entrant: ratingApps.filter(app => {
                //return app.entrantEpguGuid
                //return [104977,3380,5973,103058,105724,3245].indexOf(app.orderNid) > -1
                return app.entrantEpguGuid && app.appEpguGuid
            }).map(app => {
                rang++
                const item = {
                    Rating: rang,
                    Snils: app.snils,
                    GuidEntrant: app.entrantEpguGuid,
                    Priority: app.priority,
                    TopPriority: app.priorityTop ? 'true' : 'false',
                    WithoutTests: 'false',
                    AchievementsMark: app.achievementBall,
                    EntranceTestMark: app.ballEntrance,
                    SumMark: app.ball,
                    Benefit: 'false',
                    Original: app.podldoc
                }

                if (app.snils)
                    item.Snils = app.snils

                let testIndex = 0

                for (const test of app.tests) {
                    if (test.minimalReached) {
                        testIndex++
                        item['EntranceTest' + testIndex] = test.subjectName
                        item['Result' + testIndex] = test.ball
                    }
                }

                return item
            })
        }

        const dataPackageXml = this.jsonToXml({
            PackageData: {RankedCompetition: dataPackage},
        })



        const data: any = {
            Name: entity.name,
            Uid: 'ranked-compet:' + entity.id + '-' + dayjs().format('-YYYY-MM-DD-HH-mm'),
            Base64File: await Buffer.from(dataPackageXml).toString('base64'),
            //rating: dataPackage
        }
        if (!dataPackage.Entrant.length) {
            data.EMPTY = true
            this.idJwt = 222
            await this.savePromise()
        }

        return {
            'RankedCompetitionListPackage': data
        }
    }

    async onProcessResult() {

        let admission: EduAdmissionModel = await this.getArgEntity()

        //await admission.savePromise()

        return true
    }

}


