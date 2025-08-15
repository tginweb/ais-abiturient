import {modelOptions} from "@typegoose/typegoose";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {EduFisMessageModel} from "~modules/edu-org/modules/fis/core/message";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core";
import {EduSubjectModel} from "~modules/edu-org/modules/subject/core";
import {EduDecreeModel} from "~modules/edu-org/modules/decree/core";
import {formatEpguDate, formatEpguDatetime, formatToEpguDate} from "~modules/edu-org/modules/epgu/core/util";

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
export class DecreeUpdate extends EduFisMessageModel {

    get fisEntityType() {
        return 'DecreeUpdate'
    }

    get fisAction() {
        return 'Add'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {

        const decrees: EduDecreeModel[] = await this.getArgEntities()
        const objects = []

        for (const decree of decrees) {

            let data: any = {
                OrderOfAdmissionUID: decree.nid,
                CampaignUID: '2023_' + decree.ccampaign,
                OrderNumber: decree.aisNumber,
                OrderDate: formatToEpguDate(decree.pubDate, 'jsdate'),
                OrderName: decree.name
            }

            objects.push(data)
        }

        return {
            Orders: {
                OrdersOfAdmission: {
                    OrderOfAdmission: objects
                }
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


