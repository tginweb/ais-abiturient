import {prop} from "@typegoose/typegoose";

export class AbitAppModelEpgu {
    @prop()
    public uid: string

    @prop()
    public uidEpgu: number


    @prop()
    public registerAt: Date;

    @prop()
    public updateAt: Date;

    @prop()
    public priority: number;

    @prop()
    public cstatus: number


    @prop()
    public agree: boolean

    @prop({_id: false})
    public state: object

    @prop()
    public diff: boolean

}
