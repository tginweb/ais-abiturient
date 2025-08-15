import {prop} from "@typegoose/typegoose";
import {DocRequestHeader} from "./request-header";

export class DocRequest {

    @prop({_id: false, default: {}})
    header: DocRequestHeader

    @prop({_id: false})
    payload: object

    @prop({_id: false, cfilter: true})
    payloadXml: string

    @prop({})
    token: string
}
