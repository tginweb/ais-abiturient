import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order";

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
export class CompetitiveGroupStatusToInorder extends EduEpguMessageModel {

    get epguEntityType() {
        return 'CompetitiveGroupStatusList'
    }

    get epguAction() {
        return 'Edit'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {

        const orders: AbitOrderModel[] = await this.getArgEntities()

        let IdObject = 1
        const objects = []

        for (const order of orders) {

            const zachCompet = await this.service.competitionService.query().where({id: order.prezachCompetitionId}).execOne()

            const adm = await zachCompet.getAdmission()

            for (const appGroup of await order.getAppGroups()) {

                if (appGroup.epguGuid) {

                    const apps = await appGroup.getActiveAppsCollection()

                    for (const app of apps.all()) {
                        if (app.isBudget && (app.statusId === AppStatusEnum.INORDER)) {
                            if (app.competitionId === zachCompet.id) {
                                const object = {
                                    IdObject: IdObject++,
                                    GuidApplication: appGroup.epguGuid,
                                    UidCompetition: zachCompet.uid,
                                    IdStatus: AppStatusEnum.INORDER,
                                    StatusComment: 'включено в приказ на зачисление'
                                }
                                objects.push(object)
                            }
                        }
                    }
                } else {
                    console.log(appGroup.id)
                }
            }
        }

        return {
            'CompetitiveGroupStatusList': {
                'CompetitiveGroupStatus': objects
            }
        }
    }

    async onProcessResult() {

        //let admission: EduAdmissionModel = await this.getArgEntity()

        //await admission.savePromise()

        return true
    }

}


