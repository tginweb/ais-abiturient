import {arrayProp, prop} from "@typegoose/typegoose";
import {Quota} from "./quota";

export class FieldsBenefits {

    @arrayProp({items: Quota})
    public quotes: Quota[];

    @prop()
    public advantages: [];
}

