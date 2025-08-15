import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order";
import {formatToEpguDate, formatToEpguDatetime} from "~modules/edu-org/modules/epgu/core/util";

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
export class OriginalEducationDocumentListAdd extends EduEpguMessageModel {

    get epguEntityType() {
        return 'OriginalEducationDocumentList'
    }

    get epguAction() {
        return 'Add'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async getPacket(entity: AbitOrderModel, IdObjects) {
        const packet: any = {
            IdObject: IdObjects.length + 1,
            GuidEntrant: entity.epgu.guid,
            OrigDocDate: formatToEpguDatetime(entity.getEduOrigDocDate(), 'jsdate')
        }
        return packet
    }

    async onProcessResult() {

        let admission: EduAdmissionModel = await this.getArgEntity()

        //await admission.savePromise()

        return true
    }

}


