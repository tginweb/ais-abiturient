import {arrayProp, prop, Ref} from "@typegoose/typegoose";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {EduSourceModel} from "~modules/edu-org/modules/source/core/model";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";

export class ItemApplication extends EduEntityModel {

    _id: Number | string

    @prop({cfilter: true, default: false})
    deleted: boolean

    @prop({cfilter: true})
    deletedSource: string

    @prop({cfilter: true})
    eduProgramNid: number

    @prop()
    csource: number

    @prop()
    createAt: Date

    @prop()
    cappsource: string // epgu

    @prop({
        default: 0
    })
    priority: number

    @arrayProp({items: Number})
    specs: number[]

    @prop()
    statusId: number

    @prop()
    statusMessage: string

    @prop()
    agree: boolean;

    @prop()
    agreeDate: Date;

    @prop()
    agreeDeny: boolean;

    @prop()
    agreeDenyDate: Date;

    @prop()
    celevOrg: string

    /* VIRTUALS */

    @prop({ref: EduAdmissionModel, localField: "eduProgramNid", foreignField: "id", justOne: true})
    public admission?: EduAdmissionModel;

    @prop({ref: EduSourceModel, localField: "csource", foreignField: "id", justOne: true})
    public source?: EduSourceModel

    @prop({ref: EduAdmissionModel, localField: "specs", foreignField: "id", justOne: false})
    public specsAdmissions?: EduAdmissionModel;



}
