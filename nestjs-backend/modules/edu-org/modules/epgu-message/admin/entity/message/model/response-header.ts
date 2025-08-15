import {modelOptions, plugin, prop} from "@typegoose/typegoose";

export class DocResponseHeader {
    @prop({})
    IdJwt: number;

    @prop({})
    PayloadType: string;

    @prop({})
    EntityType: string;

    @prop({})
    Entity: string;

    @prop({})
    Action: string;
}

