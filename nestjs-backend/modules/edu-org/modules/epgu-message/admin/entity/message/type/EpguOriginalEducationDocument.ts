import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})
export class EpguOriginalEducationDocument extends EduEpguMessageModel {

    get epguEntityType() {
        return 'EpguOriginalEducationDocument'
    }

    get epguAction() {
        return 'Get'
    }

    get title() {
        return 'Изменение состава конкурсных групп'
    }

    getArgs() {
        return this.args
    }

    async onProcessResult() {


        return true
    }

}


