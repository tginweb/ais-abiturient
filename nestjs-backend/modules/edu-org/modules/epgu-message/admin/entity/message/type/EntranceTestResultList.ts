import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "../model";

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})

export class EntranceTestResultList extends EduEpguMessageModel {

    get epguEntityType() {
        return 'EntranceTestResultList'
    }

}


