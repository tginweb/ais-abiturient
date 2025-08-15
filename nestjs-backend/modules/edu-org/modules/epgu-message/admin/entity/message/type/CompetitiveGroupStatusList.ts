import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";

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
export class CompetitiveGroupStatusList extends EduEpguMessageModel {

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
        const entity: EduAdmissionModel = await this.getArgEntity()

        let IdObject = 1

        const objects = []

        const aisEntrantService = this.context.service.aisEntrantService

        let cnt = 0

        for (const line of lines0.split("\n")) {

            const [snils, appGuid, competUid] = line.split(';')
            const [adm, uid] = competUid.split(':')
            const [cadmission, csource] = uid.split('.')

            const cadmissionId = parseInt(cadmission)

            const aisEntrant = await aisEntrantService.findOne({
                snils: snils
            })

            /*
            if (
                !aisEntrant ||
                aisEntrant.state !== 1 ||
                cadmissionId !== aisEntrant.cadmission ||
                aisEntrant.cset !== 3
            ) {
                continue;
            }
             */

            //console.log([line, aisEntrant.id])

            cnt++

            if (!appGuid)
                continue;

            const object = {
                IdObject: IdObject++,
                GuidApplication: appGuid,
                UidCompetition: competUid,
                IdStatus: AppStatusEnum.STUDENT,
                //IdReasonRejection: 27,
                //StatusComment: 'не прошло по конкурсу'
            }

            if (IdObject < 999) {
                objects.push(object)
            } else {
                break;
            }


        }

        console.log(cnt, 'cnt')

        return {
            'CompetitiveGroupStatusList': {
                'CompetitiveGroupStatus': objects
            }
        }
    }

    async onProcessResult() {

        let admission: EduAdmissionModel = await this.getArgEntity()

        //await admission.savePromise()

        return true
    }

}


