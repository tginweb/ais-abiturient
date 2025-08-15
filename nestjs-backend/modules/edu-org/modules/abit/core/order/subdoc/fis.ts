import {prop} from "@typegoose/typegoose";

export class OrderModelFis {

    @prop()
    public exportedSuccessDate: Date

    @prop()
    public exported: Boolean
}
