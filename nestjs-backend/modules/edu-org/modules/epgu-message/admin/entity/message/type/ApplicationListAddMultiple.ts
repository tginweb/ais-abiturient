import {modelOptions} from "@typegoose/typegoose";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {ApplicationListAdd} from "./ApplicationListAdd";


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
export class ApplicationListAddMultiple extends ApplicationListAdd {

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
            //if ([5007,108450,108627,108520,108089,108649].indexOf(entrant.nid) === -1) {
                packets = [...packets, ...(await this.getPackets(entrant, IdObjects))]
            //}
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

        /*
        let order: AbitOrderModel = await this.getArgEntity()
        const payload: any = this.response.payload

        const app = payload?.SuccessResultList?.Application

        order.epgu.guid = app.GuidEntrant
        await order.savePromise()

         */
        return true
    }

}


