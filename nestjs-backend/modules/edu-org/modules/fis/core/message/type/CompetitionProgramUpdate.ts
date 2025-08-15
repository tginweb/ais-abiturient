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
export class CompetitionProgramUpdate extends EduFisMessageModel {

    get fisEntityType() {
        return 'CompetitionProgramUpdate'
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

        let index = 0

        for (const competition of competitions) {

            const admission = await competition.getAdmission()
            const dir = admission.direction

            if (!dir) {
                console.log(admission.abbr)
                continue;
            }

            let cfobCode

            if (!competition.admissionNumber)
                continue;

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

            let data: any = {
                UID: competition.fisProgramUid,
                Name: 'Программа: ' + admission.direct_name + ' ' + index++,
                Code: dir.cod
            }

            objects.push(data)
        }

        return {
            InstitutionPrograms: {
                InstitutionProgram: objects
            }
        }
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


