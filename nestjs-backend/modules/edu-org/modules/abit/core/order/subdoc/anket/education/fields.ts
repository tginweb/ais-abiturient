import {arrayProp, prop, Ref} from "@typegoose/typegoose";
import {FileModel} from "~modules/file/core/model";
import {OrderModelDataDoc} from "../../_doc";
import {EduLevelModel} from "~modules/edu-org/modules/level/core/model";


export class FieldsEducation {
    @prop({cfilter: true})
    public prevEduLevel: number;

    @prop()
    public irnituEdu2020: boolean;

    @prop()
    public specialty: string;

    @prop()
    public level: number;

    @prop()
    public docType: number;

    @prop({default: 'russia'})
    public docCountryType: string;

    @prop({_id: false, default: {_hold: true}})
    public docCity: object;

    @prop({_id: false, default: {}})
    public doc: OrderModelDataDoc

    @prop({})
    public docFile: string[];

    @prop({ref:  () => FileModel, localField: "docFile", foreignField: "_id"})
    public docFileModel: Ref<FileModel>[];


    @prop()
    public docFileLocked: boolean;


    @prop({ref:  () => EduLevelModel, localField: "prevEduLevel", foreignField: "id", justOne: true})
    public prevEduLevelDoc: EduLevelModel;

}
