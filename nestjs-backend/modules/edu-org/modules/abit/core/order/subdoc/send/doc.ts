import {prop, Ref} from "@typegoose/typegoose"
import {OrderModelStepStatus} from "../step-status"
import {FileModel} from "~modules/file/core/model"

export class StepSend {

    @prop({
        _id: false,
    })
    public fields: object;


    @prop({})
    public orderDocFile: string[];

    @prop({ref: () => FileModel, localField: "orderDocFile", foreignField: "_id"})
    public orderDocFileModel: Ref<FileModel>[];


    @prop({})
    public agreementDocFile: string[];

    @prop({ref: () => FileModel, localField: "agreementDocFile", foreignField: "_id"})
    public agreementDocFileModel: Ref<FileModel>[];


    @prop({})
    public agreementDenyDocFile: string[];

    @prop({ref: () => FileModel, localField: "agreementDenyDocFile", foreignField: "_id"})
    public agreementDenyDocFileModel: Ref<FileModel>[];


    @prop({})
    public photoFile: string;

    @prop({ref: () => FileModel, localField: "photoFile", foreignField: "_id", justOne: true})
    public photoFileModel: Ref<FileModel>;



    @prop({})
    public consentDocFile: string[];

    @prop({ref: () => FileModel, localField: "consentDocFile", foreignField: "_id"})
    public consentDocFileModel: Ref<FileModel>[];


    @prop({})
    public consentDistDocFile: string[];

    @prop({ref: () => FileModel, localField: "consentDistDocFile", foreignField: "_id"})
    public consentDistDocFileModel: Ref<FileModel>[];


    @prop({})
    public targetContractDocFile: string[];

    @prop({ref: () => FileModel, localField: "targetContractDocFile", foreignField: "_id"})
    public targetContractDocFileModel: Ref<FileModel>[];


    @prop({ref: () => FileModel})
    public compatriotFile?: Ref<FileModel>;


    @prop({})
    public compatriotBirthDocFile: string[];

    @prop({ref: () => FileModel, localField: "compatriotBirthDocFile", foreignField: "_id"})
    public compatriotBirthDocFileModel: Ref<FileModel>[];


    @prop({})
    public compatriotParentDocFile: string[];

    @prop({ref: () => FileModel, localField: "compatriotParentDocFile", foreignField: "_id"})
    public compatriotParentDocFileModel: Ref<FileModel>[];


    @prop({
        _id: false,
        default: {}
    })
    public status: OrderModelStepStatus;
}
