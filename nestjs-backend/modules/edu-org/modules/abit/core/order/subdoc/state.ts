import {prop} from "@typegoose/typegoose";
import {AbitOrderStatusEnum, abitOrderStatusListById} from "../statics/status";

export class OrderModelState {

    @prop({cfilter: true, default: false})
    public changedFromEpgu: boolean

    @prop({cfilter: true, default: 'draft'})
    public status: AbitOrderStatusEnum


    @prop()
    public message: string

    @prop()
    public userId: string

    @prop()
    public created: Date;

    get statusInfo() {
        return abitOrderStatusListById[this.status]
    }
}
