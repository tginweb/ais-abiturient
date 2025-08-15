import {prop} from "@typegoose/typegoose";

export class OrderModelAis {

    @prop({cfilter: true})
    public aisId: number;

    @prop({})
    public aisStatusId: number

    @prop({})
    public name: string

    @prop({})
    public citem: number

    @prop({})
    public registerAt: Date


    @prop({default: {}, _id: false})
    public state: object

    @prop()
    public diff: boolean;

    get aisStatusTitle() {
        return 'ssss'
    }
}
