import {modelOptions} from "@typegoose/typegoose";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduDocModel} from "~modules/edu-org/modules/doc/core/model";


const dayjs = require('dayjs')

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})
export class DocumentListGet extends EduEpguMessageModel {

    get epguEntityType() {
        return 'DocumentList'
    }

    get epguAction() {
        return 'Get'
    }

    getArgs() {
        return this.args
    }

    async getPacket(entity: EduDocModel, IdObjects) {

        if (!entity.epgu.guid)
            return false;

        entity.addContext(this.service.abitOrderService.modelContext())

        const applications = []

        IdObjects.push(entity.id)

        const packet = {
            IdObject: IdObjects.length,
            Guid: entity.epgu.guid
        }

        return packet
    }

    async onProcessResult() {

        let order: AbitOrderModel = await this.getArgEntity()
        const payload: any = this.response.payload

        let docs = payload?.SuccessResultList?.Document

        docs = Array.isArray(docs) ? docs : [docs]

        let idObject = 1
        for (const doc of docs) {
            const docId = this.args.params['objects'] ? this.args.params['objects'][idObject-1] : null
            await this.context.service.eduDocService.updateDocFromEpgu(doc, docId)
            idObject++
        }

        return true
    }

}


