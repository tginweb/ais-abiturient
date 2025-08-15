import {prop} from "@typegoose/typegoose";

export class ItemFamily {

    @prop()
    public familyType: number;

    @prop({
        default: ''
    })
    public fio: string;

    @prop({})
    public phone: string;

    @prop({})
    public email: string;

    @prop({})
    public address: string;

    @prop({})
    public work: string;
}

