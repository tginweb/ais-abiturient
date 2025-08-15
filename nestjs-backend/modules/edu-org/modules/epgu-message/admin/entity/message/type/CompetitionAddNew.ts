import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import parseCsvFile from "~lib/util/data/parseCsvFile";
import * as path from "path";
import {EduAdmissionCompetitionModel} from "~modules/edu-org/modules/admission/core/model/competion";

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

        //const entity: EduAdmissionModel = await this.getArgEntity()

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

        const competitions = []

        let IdObject = 1

        let dopnabRows: any = await parseCsvFile(path.join(process.cwd(), 'import/dopnab.csv'), null, ';')

        for (const dopnabRow of dopnabRows) {

            const adm = await this.service.admissionService.query().withViewPublic().where({abbr: dopnabRow.abbr}).execOne()

            const types = [
                {field: 'budgPlaces', source: 1, name: 'бюджет'},
                {field: 'lgotQuota', source: 2, name: 'особая квота'},
                {field: 'celevQuota', source: 4, name: 'целевой'},
                {field: 'specQuota', source: 5, name: 'отдельная квота'},
            ]

            for (let t = 0; t < types.length; t++) {

                const type = types[t]

                const nabor = parseInt(dopnabRow[type.field]) || 0

                if (!nabor) continue;

                let comment = adm.name + ', допнабор'

                const competUid = 'dopadm:' + adm.id + '.' + type.source

                let data: any = {
                    IdObject: IdObject++,
                    OgrnOwnerOrganization: 1023801756120,
                    KppOwnerOrganization: 381201001,
                    Uid: competUid,
                    UidCampaign: this.context.service.epguApi.getCampaingUid(),
                    UidOrgDirection: 'dir:' + adm.direction['cod'],
                    Name: adm.direct_name,
                    IdEducationLevel: levels[adm.clevel],
                    IdEducationForm: fobs[adm.cfob],
                    IdPlaceType: placeTypes[type.source],
                    NumberPlaces: nabor,
                    IdStageAdmission: 4,
                    OnlyForForeigners: false,
                    OnlyCitizensRF: false,
                    SecondEducationArts: false,
                    PreviewTours: false,
                    AttachingPortfolio: false,
                    MedicalExamination: false,
                    Comment: comment
                }
                competitions.push(data)
            }
        }

        return {
            'CompetitionList': {
                'Competition': competitions
            }
        }
    }

    async onProcessResult() {

        let admission: EduAdmissionModel = await this.getArgEntity()

        //await admission.savePromise()

        return true
    }

}


