import {modelOptions} from "@typegoose/typegoose";
import {EduSSEntrantModel} from "~modules/edu-org/modules/ss-entrant/core";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";

const dayjs = require('dayjs')

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})
export class OriginalEducationDocumentList extends EduEpguMessageModel {

    get epguEntityType() {
        return 'OriginalEducationDocumentList'
    }

    get epguAction() {
        return 'Get'
    }

    getArgs() {
        return this.args
    }

    async generatePayload() {

        const docs: EduSSEntrantModel[] = await this.getArgEntities()
        let objects = []
        let IdObject = 1

        for (const doc of docs) {
            const object = {
                IdObject: IdObject++,
                GuidEntrant: doc.guid
            }
            IdObject++
            objects.push(object)
        }

        return {
            'OriginalEducationDocumentList': {
                'OriginalEducationDocument': objects
            }
        }
    }

    async onProcessResult() {

        const payload: any = this.response.payload

        let docs = payload?.SuccessResultList?.OriginalEducationDocument

        docs = Array.isArray(docs) ? docs : [docs]

        for (const doc of docs) {
            await this.service.abitOrderService.setEducationDocOriginalOrgFromEpgu(doc.GuidEntrant, doc)
        }

        return true
    }

}


