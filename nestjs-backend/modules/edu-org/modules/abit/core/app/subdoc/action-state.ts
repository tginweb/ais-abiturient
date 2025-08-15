import {prop} from "@typegoose/typegoose";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";

export class AbitAppModelActionState {
    @prop()
    public priority: number

    @prop()
    public statusId: AppStatusEnum


    @prop()
    public agree: boolean

    @prop()
    public agreeDeny: boolean

    @prop()
    public cancelSource: AbitWorkplaceEnum
}
