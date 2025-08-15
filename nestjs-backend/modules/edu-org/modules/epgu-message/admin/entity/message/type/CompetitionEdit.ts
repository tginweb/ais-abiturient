import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core";
import parseCsvFile from "~lib/util/data/parseCsvFile";
import * as path from "path";

interface DocArgs {
    snils: string
    guid: string
}

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})
export class CompetitionEdit extends EduEpguMessageModel {

    get epguEntityType() {
        return 'CompetitionList'
    }

    get epguAction() {
        return 'Edit'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {

        let competStatRows: any = await parseCsvFile(path.join(process.cwd(), 'import/compet-stat.csv'), null, ';')

        const competStat = competStatRows.reduce((map, compet) => {
            map[compet.competUid] = parseInt(compet.cnt)
            return map
        }, {})

        const competitions: EduCompetitionModel[] = await this.getArgEntities()

        const levels = {
            1: 3,
            2: 2,
        }

        const fobs = {
            1: 1,
            2: 3,
            3: 2,
        }

        const placeTypes = {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            7: 8,
            8: 6,
        }


        const objects = []

        let IdObject = 1

        for (const competition of competitions) {

            const admission = await competition.getAdmission()

            let comment = competition.name

            let admissionNumber

            if (!competStat[competition.uid]) {
                admissionNumber = 0
            } else {
                admissionNumber = parseInt(competStat[competition.uid])
            }


            let data: any = {
                IdObject: IdObject++,
                OgrnOwnerOrganization: 1023801756120,
                KppOwnerOrganization: 381201001,
                Uid: competition.uid,
                UidOrgDirection: 'dir:' + admission.direction['cod'],
                Name: admission.direct_name,
                IdEducationLevel: levels[competition.clevel],
                IdEducationForm: fobs[competition.cfob],
                IdPlaceType: placeTypes[competition.csource],
                NumberPlaces: admissionNumber,
                IdStageAdmission: competition.isdop ? 4 : 1,
                OnlyForForeigners: false,
                OnlyCitizensRF: false,
                SecondEducationArts: false,
                PreviewTours: false,
                AttachingPortfolio: false,
                MedicalExamination: false,
                Comment: comment
            }

            objects.push(data)
        }


        return {
            'CompetitionList': {
                'Competition': objects
            }
        }
    }

    async onProcessResult() {

        let admission: EduAdmissionModel = await this.getArgEntity()

        //await admission.savePromise()

        return true
    }

}


