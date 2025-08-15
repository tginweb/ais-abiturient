import {prop} from "@typegoose/typegoose";
import {OrderModelStepStatus} from "../step-status";
import {FieldsPersonal} from "./personal/fields";
import {FieldsEducation} from "./education/fields";
import {FieldsEntrance} from "./entrace/fields";
import {FieldsBenefits} from "./benefits/fields";

export class StepAnket {

    @prop({_id: false})
    public fields?: object;

    @prop({_id: false, default: {}})
    public personal: FieldsPersonal;

    @prop({_id: false, default: {}})
    public education: FieldsEducation;

    @prop({
        _id: false,
        default: {
            subjects: [],
            olimpics: [],
            achievements: []
        }
    })
    public entrance: FieldsEntrance;

    @prop({
        _id: false,
        default: {
            quotes: [],
            advantages: [],
        }
    })
    public benefits: FieldsBenefits;

    @prop({_id: false, default: {}})
    public status: OrderModelStepStatus;
}
