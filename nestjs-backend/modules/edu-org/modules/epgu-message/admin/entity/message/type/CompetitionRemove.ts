import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";

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
export class CompetitionRemove extends EduEpguMessageModel {

    get epguEntityType() {
        return 'CompetitionList'
    }

    get epguAction() {
        return 'Remove'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {
        const entity: EduAdmissionModel = await this.getArgEntity()

        const levels = {
            1: 3,
            2: 2,
        }

        const fobs = {
            1: 1,
            2: 3,
        }

        const placeTypes = {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
        }
        /*


         */

        const competitions = []

        let IdObject = 1

        for (const competition of entity.competitions) {

            if (!competition.celevOrg)
                continue;

            const competUid = competition.celevOrg ? 'adm:' + entity.id + '.' + competition.csource + '.cel.' + competition.celevOrg :  'adm:' + entity.id + '.' + competition.csource

            if (competition.admissionNumber) {
                const data = {
                    OgrnOwnerOrganization: 1023801756120,
                    KppOwnerOrganization: 381201001,
                }
                data['IdObject'] = IdObject++
                data['Uid'] = competUid
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


