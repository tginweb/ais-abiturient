import {prop} from "@typegoose/typegoose";
import {AppStatusEnum, appStatusListById} from "~modules/edu-org/modules/abit/core/app/enum";

export class AbitAppModelLk {

    @prop()
    public uid: string

    @prop()
    public registerAt: Date;

    @prop()
    public updateAt: Date;

    @prop()
    public priority: number;

    @prop()
    public statusId: AppStatusEnum

    @prop()
    public createAt: Date

    get status() {
        return appStatusListById[this.statusId]
    }

    get registerAtComputed() {
        return this.registerAt || this.createAt
    }
}
