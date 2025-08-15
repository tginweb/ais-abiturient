import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import parseCsvFile from "~lib/util/data/parseCsvFile";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core";

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
export class CompetitionAdd extends EduEpguMessageModel {

    get epguEntityType() {
        return 'CompetitionList'
    }

    get epguAction() {
        return 'Add'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {

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

        let IdObject = 1

        const objects = []

        for (const competition of competitions) {

            if (competition.isdop) {

                const admission = await competition.getAdmission()

                let comment = competition.name

                let data: any = {
                    IdObject: IdObject++,
                    UidCampaign: this.context.service.epguApi.getCampaingUid(),
                    OgrnOwnerOrganization: 1023801756120,
                    KppOwnerOrganization: 381201001,
                    Uid: competition.uid,
                    UidOrgDirection: 'dir:' + admission.direction['cod'],
                    Name: admission.direct_name,
                    IdEducationLevel: levels[competition.clevel],
                    IdEducationForm: fobs[competition.cfob],
                    IdPlaceType: placeTypes[competition.csource],
                    NumberPlaces: competition.admissionNumberTotal,
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


