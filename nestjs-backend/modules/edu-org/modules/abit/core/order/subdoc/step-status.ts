import {prop} from "@typegoose/typegoose";

export class OrderModelStepStatus {

    @prop()
    public status: string;

    @prop()
    public message: string;
}