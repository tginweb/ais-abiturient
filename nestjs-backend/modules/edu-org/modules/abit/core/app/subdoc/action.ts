import {prop} from "@typegoose/typegoose";
import {AbitAppModelActionState} from "./action-state";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";

export class AbitAppModelAction {

    @prop({default: {}})
    public from: AbitAppModelActionState

    @prop({default: {}})
    public to: AbitAppModelActionState

    @prop({})
    public userId: string

    @prop({})
    public source: AbitWorkplaceEnum

    @prop({})
    public createAt: Date

    @prop({})
    public message: string
}
