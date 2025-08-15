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
export class EntrantListGetMultipleGuid extends EduEpguMessageModel {

    get epguEntityType() {
        return 'EntrantList'
    }

    get epguAction() {
        return 'Get'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {

        let objects = []

        let IdObject = 1

        for (const guid of this.args.guids) {
            const object = {
                IdObject: IdObject++,
                Guid: guid
            }
            objects.push(object)
        }

        return {
            'EntrantList': {
                Entrant: objects
            }
        }
    }

    async onProcessResult() {

        const payload: any = this.response.payload

        const entrants = payload?.SuccessResultList?.Entrant

        if (entrants){
            for (const entrant of entrants) {
                await this.context.service.eduSSEntrantService.ensureServiceEntrant(entrant)
            }
        }

        return true
    }

}


