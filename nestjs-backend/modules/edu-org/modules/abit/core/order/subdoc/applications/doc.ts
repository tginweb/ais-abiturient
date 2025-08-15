import {arrayProp, prop} from "@typegoose/typegoose";
import {ItemApplication} from "./item-application";

export class StepApplications {

    @prop({_id: false})
    public fields: object;

    @arrayProp({items: ItemApplication})
    public items: ItemApplication[];
}
