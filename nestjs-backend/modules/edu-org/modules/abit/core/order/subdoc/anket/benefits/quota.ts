import {arrayProp, prop, Ref} from "@typegoose/typegoose"
import {FileModel} from "~modules/file/core/model"
import {OrderModelDataDoc} from "../../_doc"

export class Quota {

    @prop({cfilter: true})
    public quotaType: number;

    @prop({
        default: false
    })
    public haveDoc: boolean;

    @prop({
        _id: false,
        default: {
            doc: {},
        }
    })
    public doc: OrderModelDataDoc


    @prop({})
    public docFile: string[];

    @prop({ref:  () => FileModel, localField: "docFile", foreignField: "_id"})
    public docFileModel: Ref<FileModel>[];

}


