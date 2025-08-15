import {prop} from "@typegoose/typegoose";


export class EpguApp {
    @prop()
    uidEpgu: number

    @prop()
    agree?: boolean

    @prop()
    cadmission?: number

    @prop()
    csource?: boolean

    @prop()
    fetched: boolean

    @prop()
    state?: object
}

export class OrderModelEpgu {

    @prop({cfilter: true})
    public lastNew: boolean

    @prop({cfilter: true})
    public guid: string

    @prop()
    public snils: string

    @prop()
    public fetchedAt: number;

    @prop()
    public apps: EpguApp[];

    @prop({default: {}, _id: false})
    public state: object

    @prop()
    public diff: boolean;

}
