import {modelOptions} from "@typegoose/typegoose";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {EduFisMessageModel} from "~modules/edu-org/modules/fis/core/message";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core";
import {EduSubjectModel} from "~modules/edu-org/modules/subject/core";
import {EduDecreeModel} from "~modules/edu-org/modules/decree/core";
import {formatEpguDate, formatEpguDatetime, formatToEpguDate} from "~modules/edu-org/modules/epgu/core/util";
import {EduVolumeModel} from "~modules/edu-org/modules/volume/core";

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
export class VolumeUpdate extends EduFisMessageModel {

    get fisEntityType() {
        return 'VolumeUpdate'
    }

    get fisAction() {
        return 'Add'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {

        const volumes: EduVolumeModel[] = await this.getArgEntities()
        const objects = []

        for (const volume of volumes) {

            const fisDirection = await this.context.service.fisApi.getDirectionByOkso(volume.direction.cod)

            if (!fisDirection) {
                console.log(volume)
                continue;
            }

            let data: any = {
                UID: volume.direction.cod,
                CampaignUID: '2023_' + volume.ccampaign,
                EducationLevelID: volume.fisEducationLevelID,
                DirectionID: fisDirection.DirectionID,

                NumberBudgetO: volume.budgetO,
                NumberBudgetOZ: volume.budgetOZ,
                NumberBudgetZ: volume.budgetZ,

                NumberPaidO: volume.paidO,
                NumberPaidOZ: volume.paidOZ,
                NumberPaidZ: volume.paidZ,

                NumberTargetO: volume.targetO,
                NumberTargetOZ: volume.targetOZ,
                NumberTargetZ: volume.targetZ,

                NumberQuotaO: volume.quotaO,
                NumberQuotaOZ: volume.quotaOZ,
                NumberQuotaZ: volume.quotaZ,

                NumberSeparateQuotaO: volume.otdelO,
                NumberSeparateQuotaOZ: volume.otdelOZ,
                NumberSeparateQuotaZ: volume.otdelZ,

                IsPlan: false,
                IsUGS: false,
            }

            objects.push(data)
        }

        return {
            AdmissionInfo: {
                AdmissionVolume: {
                    Item: objects
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


