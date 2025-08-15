import {modelOptions, plugin, prop} from "@typegoose/typegoose";

export class DocResponsePayload {
    @prop({})
    PackageData: string;
}

