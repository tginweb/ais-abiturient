import {modelOptions} from "@typegoose/typegoose";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {OriginalEducationDocumentListAdd} from './OriginalEducationDocumentListAdd'

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
export class OriginalEducationDocumentListAddMultiple extends OriginalEducationDocumentListAdd {

    get epguEntityType() {
        return 'OriginalEducationDocumentList'
    }

    get epguAction() {
        return 'Add'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {

        const orders: AbitOrderModel[] = await this.getArgEntities()

        let packets = []
        let IdObjects = []

        for (const order of orders) {
            if (order.podldoc) {
                packets.push(await this.getPacket(order, IdObjects))
                IdObjects.push(order.id)
            }
        }

        return {
            'OriginalEducationDocumentList': {
                'OriginalEducationDocument': packets
            }
        }
    }

    async onProcessResult() {

        let admission: EduAdmissionModel = await this.getArgEntity()

        //await admission.savePromise()

        return true
    }

}


