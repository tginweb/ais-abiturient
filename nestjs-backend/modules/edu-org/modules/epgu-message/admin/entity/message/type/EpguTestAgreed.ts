import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})
export class EpguTestAgreed extends EduEpguMessageModel {

    get epguEntityType() {
        return 'EpguTestAgreed'
    }

    get epguAction() {
        return 'Get'
    }

    get title() {
        return 'Запись на ВИ'
    }

    getArgs() {
        return this.args
    }

    async onProcessResult() {


        return true
    }

}


