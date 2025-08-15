import {arrayProp, prop, Ref} from "@typegoose/typegoose"
import {FileModel} from "~modules/file/core/model"
import {OrderModelDataDoc} from "../../_doc"
import {ItemFamily} from "./item-family"
import {cisCitizenTypeEnum} from "~modules/edu-org/enum/ais-student-status";

export class FieldsPersonal {

    @prop({cfilter: true})
    public inn: string;

    @prop({cfilter: true})
    public snils: string;

    @prop({cfilter: true})
    public citizenship: cisCitizenTypeEnum;

    @prop({cfilter: true})
    public citizenshipCountry: number;

    @prop({cfilter: true, default: ''})
    public firstName: string;

    @prop({cfilter: true, default: ''})
    public lastName: string;

    @prop({cfilter: true, default: ''})
    public secondName: string;



    @prop()
    public birthday: string;

    @prop({cfilter: true})
    public birthplace: string;

    @prop({default: ''})
    public gender: string;


    @prop({cfilter: true})
    public phone: string;

    @prop({cfilter: true})
    public phone2: string;

    @prop({cfilter: true})
    public email: string;

    @prop({_id: false, default: {_hold: true}})
    public addressReg: object;

    @prop({_id: false, default: {_hold: true}})
    public addressLive: object;

    @prop({default: false})
    public addressEqual: boolean;

    @arrayProp({items: ItemFamily})
    public family: ItemFamily[];


    @arrayProp({items: Number})
    public languages: number[];

    @prop()
    public languageCustom: string;

    @prop({default: null})
    public needFlat: boolean;

    @prop()
    public docType: number;

    @prop({_id: false, default: {_hold: true}})
    public doc: OrderModelDataDoc

    @prop({})
    public docFile: string[];

    @prop({ref:  () => FileModel, localField: "docFile", foreignField: "_id"})
    public docFileModel: Ref<FileModel>[];

    @prop({default: false})
    public docEgeHave: boolean;

    @prop({_id: false, default: {_hold: true}})
    public docEge: OrderModelDataDoc
}
