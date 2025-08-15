import {modelOptions, plugin, prop} from "@typegoose/typegoose";
import {DocResponseHeader} from "./response-header";

export class DocDispatcher {
    @prop({})
    name: string

    @prop({_id: false})
    payload: object
}
