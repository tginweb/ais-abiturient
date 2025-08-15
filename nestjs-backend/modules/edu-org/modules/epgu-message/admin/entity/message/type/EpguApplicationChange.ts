import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})
export class EpguApplicationChange extends EduEpguMessageModel {

    get epguEntityType() {
        return 'EpguApplicationChange'
    }

    get epguAction() {
        return 'Get'
    }

    get title() {
        return 'Изменение заявления'
    }

    getArgs() {
        return this.args
    }

    async onProcessResult() {

        return true
    }

}


