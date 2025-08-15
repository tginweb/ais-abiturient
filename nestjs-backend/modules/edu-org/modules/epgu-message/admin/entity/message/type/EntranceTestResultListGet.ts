import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "../model";

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})

export class EntranceTestResultListGet extends EduEpguMessageModel {

    get epguEntityType() {
        return 'EntranceTestResultList'
    }

    get epguAction() {
        return 'Get'
    }
}


