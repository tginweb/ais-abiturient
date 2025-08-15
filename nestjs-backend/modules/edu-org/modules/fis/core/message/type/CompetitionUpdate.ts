import {modelOptions} from "@typegoose/typegoose";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {EduFisMessageModel} from "~modules/edu-org/modules/fis/core/message";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core";
import {EduSubjectModel} from "~modules/edu-org/modules/subject/core";

const dayjs = require('dayjs')
const trim = require('locutus/php/strings/trim')

interface DocArgs {
    snils: string
    guid: string
}

@modelOptions({
    schemaOptions: {
        collection: "fis_message",
        discriminatorKey: "type",
    }
})
export class CompetitionUpdate extends EduFisMessageModel {

    get fisEntityType() {
        return 'CompetitionUpdate'
    }

    get fisAction() {
        return 'Add'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async getPackets(entity: AbitOrderModel, IdObjects) {


    }

    async generatePayload() {

        const competitions: EduCompetitionModel[] = await this.getArgEntities()
        const objects = []

        for (const competition of competitions) {

            const campaign = await competition.getCampaign()
            const admission = await competition.getAdmission()
            const dir = admission.direction

            if (!dir) {
                console.log(admission.abbr)
                continue;
            }

            let cfobCode

            switch (competition.cfob) {
                case 1:
                    cfobCode = 'O'
                    break;
                case 2:
                    cfobCode = 'Z'
                    break;
                case 3:
                    cfobCode = 'OZ'
                    break;
            }

            const numberTagName = 'Number' + competition.sourceFisSlug + cfobCode;

            const dateStart = dayjs('01-09-2023', 'DD.MM.YYYY')
            const dateEnd = dayjs(admission.dateend)
            const dateEndDay = parseInt(dateEnd.format('DD'))

            let dateMonthInterval = dateEnd.diff(dateStart, 'month')

            if (dateEndDay > 1) {
                dateMonthInterval++
            }

            let placesCount = competition.usedNumber

            if (!placesCount) {
                continue;
            }

            const fisDirection = await this.context.service.fisApi.getDirectionByOkso(dir.cod)

            if (!fisDirection) {
                console.log(dir.cod, 'fis dir not found')
                continue;
            }

            let data: any = {
                UID: competition.uid,
                CampaignUID: campaign.fisUid,
                Name: competition.name,
                EducationLevelID: admission.levelFisId,
                EducationFormID: admission.fobFisId,
                EducationSourceID: competition.sourceFisId,
                DirectionID: fisDirection.DirectionID,
                //IsSpecialQuota: competition.csource === 5,
                IsSpecialQuota: false,
                StudyBeginningDate: dateStart.format('YYYY-MM-DD') + 'T00:00:00+08:00',
                StudyEndingDate: dateEnd.format('YYYY-MM-DD') + 'T00:00:00+08:00',
                StudyPeriod: dateMonthInterval,
                IsAdditional: !!competition.isdop,
                EduPrograms: {
                    EduProgram: {
                        UID: competition.fisProgramUid
                    }
                },
                CompetitiveGroupItem: {
                    [numberTagName]: placesCount
                },
                EntranceTestItems: {
                    EntranceTestItem: []
                }
            }

            let index = 0

            for (const admisssionSubject of admission.subjects)
            {
                const subject: EduSubjectModel = admisssionSubject.subject as EduSubjectModel

                if (subject.id >= 40)
                    continue;

                index++

                const item: any = {
                    UID: competition.uid + '_' + admisssionSubject.csubject,
                    EntranceTestPriority: admisssionSubject.number || index
                }

                if (admisssionSubject.minimal) {
                    item.MinScore = admisssionSubject.minimal
                }

                if (subject.fisid) {
                    item.EntranceTestTypeID = 1
                    item.EntranceTestSubject = {
                        SubjectID: subject.fisid
                    }
                } else {
                    if (!admisssionSubject.centertestType)
                        admisssionSubject.centertestType = 4

                    if (admission.clevel == 3) {
                        admisssionSubject.centertestType = 2;
                    } else if (admission.clevel == 5) {
                        admisssionSubject.centertestType = 2;
                    }

                    item.EntranceTestTypeID = admisssionSubject.centertestType - 1
                    item.EntranceTestSubject = {
                        SubjectName: subject.name
                    }
                }
                data.EntranceTestItems.EntranceTestItem.push(item)
            }

            if (competition.isBudget) {
                data.LevelBudget = 1
            }

            if (competition.csource === 4) {
                data.TargetOrganizations = {
                    TargetOrganization: this.targetOrgs()
                }
            }

            objects.push(data)
        }

        return {
            AdmissionInfo: {
                CompetitiveGroups: {
                    CompetitiveGroup: objects
                }
            }
        }
    }

    targetOrgs() {
        const lines = `48460
48460
48460
2294287
2295102
2294287
49873
2294788
2322627
2294287
48460
2294692
48460
2294287
2294287
2294287
2314430
2314430
2314430
2314430
2314430
2314430
2314430
2294287
685056
48460
48460
2260494
2294720
2314430
2309233
2309694
2315301
2309184
2311010
48870
2322627
2315301
11038
2300421
685056
2315244
2321998
2315301
48460
2314430
685056
2294754
2324584
48381
48381
2294287
2294287
2321998
2321998
2294287
2309694
2294287
2294287
2316130
17901
2315979
3000000
3000001`
        const res = []
        for (const line of lines.split("\n")) {
            res.push({
                UID: line,
                ContractUID: line,
            })
        }
        return res
    }

    async onProcessResult() {

        /*
        let order: AbitOrderModel = await this.getArgEntity()
        const payload: any = this.response.payload

        const app = payload?.SuccessResultList?.Application

        order.fis.guid = app.GuidEntrant
        await order.savePromise()
         */

        return true
    }

}


