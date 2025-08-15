import {prop} from "@typegoose/typegoose";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";

export class AbitAppModelActionState {
    @prop()
    public priority: number

    @prop()
    public agree: boolean

    @prop()
    public agreeDeny: boolean

    @prop()
    public cancelSource: AbitWorkplaceEnum
}
