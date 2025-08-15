import {prop} from "@typegoose/typegoose";

export class AbitAppModelAis {
    @prop()
    public id: number

    @prop()
    public priority: number

    @prop()
    public registerAt?: Date;

    @prop()
    public changedAt: Date

    @prop()
    public cstatus: number

    @prop()
    public cstudstate: number

    @prop()
    public agree: boolean

    @prop()
    public diff: boolean
}
