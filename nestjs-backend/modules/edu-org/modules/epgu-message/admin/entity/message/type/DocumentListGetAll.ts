import {modelOptions} from "@typegoose/typegoose";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";


const dayjs = require('dayjs')

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
export class DocumentListGetAll extends EduEpguMessageModel {

    get epguEntityType() {
        return 'ApplicationList'
    }

    get epguAction() {
        return 'Add'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {

        const entrants: AbitOrderModel[] = await this.getArgEntities()

        let packets = []

        let IdObjects = []

        for (const entrant of entrants) {
           // packets = [...packets, ...(await this.getPackets(entrant, IdObjects))]
        }

        this.args.params = {objects: IdObjects}
        await this.savePromise()

        return {
            'ApplicationList': {
                'Application': packets
            }
        }
    }

    async onProcessResult() {

        let order: AbitOrderModel = await this.getArgEntity()
        const payload: any = this.response.payload

        const app = payload?.SuccessResultList?.Application

        order.epgu.guid = app.GuidEntrant
        await order.savePromise()

        return true
    }

}


