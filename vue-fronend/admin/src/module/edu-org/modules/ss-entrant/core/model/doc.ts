import {prop} from "@typegoose/typegoose";

export class EduSSEntrantDoc {
    @prop({cfilter: true})
    public name: string

    @prop({cfilter: true})
    public number: string

    @prop({cfilter: true})
    public serial: string

    @prop()
    public date: string

    @prop()
    public organization: string

    @prop()
    public subcode: string

    @prop()
    public checked: boolean
}
