import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})
export class EpguApplicationCancel extends EduEpguMessageModel {

    get epguEntityType() {
        return 'EpguApplicationCancel'
    }

    get epguAction() {
        return 'Get'
    }

    get title() {
        return 'Отзыв заявления'
    }

    getArgs() {
        return this.args
    }

    async onProcessResult() {

        console.log(this.response.payload)

        return true
    }

}


