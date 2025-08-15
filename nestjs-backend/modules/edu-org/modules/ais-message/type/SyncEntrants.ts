import {modelOptions} from "@typegoose/typegoose";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {EduAisMessageModel} from "~modules/edu-org/modules/ais-message";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core";

const dayjs = require('dayjs')
const trim = require('locutus/php/strings/trim')

interface DocArgs {
    snils: string
    guid: string
}

@modelOptions({
    schemaOptions: {
        collection: "ais_message",
        discriminatorKey: "type",
    }
})
export class SyncEntrants extends EduAisMessageModel {
    get aisEntityType() {
        return 'SyncEntrants'
    }
    get aisAction() {
        return 'Sync'
    }
    getArgs(): DocArgs {
        return this.args
    }
    async generatePayload() {

        return {
            Orders: {

            }
        }
    }
    async onProcessResult() {

        /*
        let order: AbitOrderModel = await this.getArgEntity()
        const payload: any = this.response.payload

        const app = payload?.SuccessResultList?.Application

        order.ais.guid = app.GuidEntrant
        await order.savePromise()
         */

        return true
    }

}


