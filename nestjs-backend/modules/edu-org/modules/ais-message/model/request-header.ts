import {modelOptions, plugin, prop} from "@typegoose/typegoose";

export class DocRequestHeader {
    @prop({cfilter: true})
    Entity?: string;

    @prop({cfilter: true})
    Action?: string;
}



