import {prop} from "@typegoose/typegoose";

export class OrderModelFirstApp {

    @prop()
    public cadmission: number

    @prop()
    public csource: number

    @prop()
    public cfob: number

    @prop()
    public competitionId: number

    @prop()
    public competitionUid: string
}
