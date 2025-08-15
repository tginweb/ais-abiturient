import {prop} from "@typegoose/typegoose";

export class EpguEntityState {

    @prop({cfilter: true})
    public guid: string

    @prop({cfilter: true})
    public step: string // queue | process | processed

    @prop({cfilter: true})
    public status: string // await | process | success | error

    @prop({cfilter: true})
    public statusMessage: string[]

    @prop({cfilter: true})
    public processed: boolean


    @prop({cfilter: true, default: false})
    public imported: boolean


    @prop({cfilter: true, default: false})
    public statusExportNeed: boolean

    @prop({cfilter: true, default: false})
    public statusExported: boolean

    @prop()
    public statusExportedDate: Date;


    @prop({cfilter: true, default: false})
    public exportNeed: boolean

    @prop({cfilter: true, default: false})
    public exported: boolean

    @prop()
    public exportedDate: Date;


    @prop()
    public taskId: Number;

    @prop()
    public taskIdSuccess: Number;
}
