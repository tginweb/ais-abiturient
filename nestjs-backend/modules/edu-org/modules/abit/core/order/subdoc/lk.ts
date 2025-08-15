import {prop} from "@typegoose/typegoose";
import {AbitOrderStatusEnum} from "~modules/edu-org/modules/abit/core/order/statics/status";

export class OrderModelLk {

    @prop()
    public id: string;

    @prop()
    public nid: number;

    @prop({})
    public registerAt: Date

    @prop({})
    public createAt: Date

    @prop({})
    public updateAt: Date

    @prop({})
    public sendDate: Date

    @prop({})
    public portedAll: Boolean

    @prop({})
    public portedUpdate: Boolean

    @prop({})
    public portedInsert: Boolean

    @prop({cfilter: true})
    public portedStatus: AbitOrderStatusEnum

    @prop({})
    public portedLast: Boolean


    @prop({default: {}, _id: false})
    public state: object

    @prop()
    public diff: boolean;

    @prop()
    public wasAccepted: boolean;
}
