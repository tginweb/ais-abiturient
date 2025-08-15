import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})
export class EpguCompetitiveGroupPriorityListChange extends EduEpguMessageModel {

    get epguEntityType() {
        return 'EpguCompetitiveGroupPriorityListChange'
    }

    get epguAction() {
        return 'Get'
    }

    get title() {
        return 'Изменение приоритетов конкурсных групп'
    }

    getArgs() {
        return this.args
    }

    async onProcessResult() {

        return true
    }

}


