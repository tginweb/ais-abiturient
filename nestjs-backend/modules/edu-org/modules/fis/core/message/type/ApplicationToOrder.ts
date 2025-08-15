import {modelOptions} from "@typegoose/typegoose";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
import {formatToEpguDate} from "~modules/edu-org/modules/epgu/core/util";
import {EduDocModel} from "~modules/edu-org/modules/doc/core";
import {EduDocRoleEnum} from "~modules/edu-org/modules/doc/core/enum";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {EduFisMessageModel} from "~modules/edu-org/modules/fis/core/message";
import {AbitTestPassingTypeEnum} from "~modules/edu-org/modules/abit/core/test/enum";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core";

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
export class ApplicationToOrder extends EduFisMessageModel {

    get fisEntityType() {
        return 'ApplicationToOrder'
    }

    get fisAction() {
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

            let compet: EduCompetitionModel

            for (const appGroup of await entrant.getAppGroups()) {
                const apps = await appGroup.getActiveAppsCollection()
                for (const app of apps.all()) {
                    if (app.statusId === AppStatusEnum.INORDER) {
                        compet = await app.getCompetition()
                        break;
                    }
                }
            }

            const appilcation: any = {
                ApplicationUID: '2023_' + entrant.nid,
                OrderUID: entrant.decreeNid,
                OrderTypeID: 1,
                CompetitiveGroupUID: compet.uid
            }

            if (compet.isBudget) {
                appilcation.OrderIdLevelBudget = 1
            }

            if (compet.csource === 2) {
                appilcation.BenefitKindID = 4
            }

            packets.push(appilcation)
        }

        this.args.params = {objects: IdObjects}
        await this.savePromise()

        return {
            Orders: {
                Applications: {
                    Application: packets
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


