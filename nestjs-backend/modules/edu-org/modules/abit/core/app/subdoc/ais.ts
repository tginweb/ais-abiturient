import {prop} from "@typegoose/typegoose";
import {appStatusListById} from "~modules/edu-org/modules/abit/core/app/enum";

export class AbitAppModelAis {
    @prop()
    public id: number

    @prop()
    public priority: number

    @prop()
    public realPriority: number

    @prop()
    public statusId: number

    @prop()
    public cstudstate: number

    @prop()
    public registerAt: Date

    @prop()
    public createAt: Date

    get status() {
        return appStatusListById[this.statusId]
    }

    get registerAtComputed() {
        return this.registerAt || this.createAt
    }
}
