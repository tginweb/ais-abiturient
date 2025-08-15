import {arrayProp, prop, Ref} from "@typegoose/typegoose";
import {EduSubjectModel} from "~modules/edu-org/modules/subject/core/model";
import {ObjectID} from "mongodb";

export class Subject {

    _id: ObjectID

    @prop()
    public subject: number;

    @prop({
        default: 0
    })
    public score?: number;

    @prop({
        default: 'ready' // notready | internal
    })
    public status: string;

    @prop({
        default: 0
    })
    public year?: number;


    @prop({
        default: false
    })
    public checked?: boolean;


    /* VIRTUALS */

    @prop({ref: EduSubjectModel, localField: "subject", foreignField: "id", justOne: true})
    public subjectDoc?: Ref<EduSubjectModel>;

    /* /VIRTUALS */
}
