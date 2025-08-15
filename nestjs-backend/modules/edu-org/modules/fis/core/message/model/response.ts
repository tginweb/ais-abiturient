import {modelOptions, plugin, prop} from "@typegoose/typegoose";
import {DocResponseHeader} from "./response-header";
import {DocResponsePayload} from "./response-payload";

export class DocResponse {
    @prop({_id: false, default: {}})
    header: DocResponseHeader

    @prop({_id: false})
    payload: object

    @prop({_id: false, cfilter: true})
    payloadXml: string

    @prop({})
    fileId: string

    @prop({})
    file: object

    @prop({})
    GuidEntrant: string

    @prop({})
    GuidApplication: string
}
