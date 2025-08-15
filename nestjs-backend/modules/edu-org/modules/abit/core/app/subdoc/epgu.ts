import {prop} from "@typegoose/typegoose";
import {AppStatusEnum, appStatusListById} from "~modules/edu-org/modules/abit/core/app/enum";

export class AbitAppModelEpgu {
    @prop()
    appGuid: string

    @prop()
    guid: string

    @prop()
    registerAt: Date;

    @prop()
    updateAt: Date;



    @prop()
    priorityOther: number;

    @prop()
    priorityTarget: number;

    @prop()
    statusId: AppStatusEnum

    @prop()
    statusIdUpdated: boolean

    @prop()
    lastNew: boolean


    @prop()
    createAt: Date


    @prop()
    serviceSend: Date

    @prop()
    serviceSendHash: string

    @prop()
    serviceSendResult: string

    get status() {
        return appStatusListById[this.statusId]
    }

    get priority() {
        return this.priorityOther || this.priorityTarget
    }

    get registerAtComputed() {
        return this.registerAt || this.createAt
    }

}
