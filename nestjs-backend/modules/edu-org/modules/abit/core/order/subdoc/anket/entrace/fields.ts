import {arrayProp, prop} from "@typegoose/typegoose";
import {Achievement} from "./achievment";
import {Subject} from "./subject";

export class FieldsEntrance {

    @prop()
    public schoolCertificateBall: number;

    @prop()
    public olimpics: [];

    @arrayProp({items: Achievement})
    public achievements: Achievement[];

    @arrayProp({items: Subject})
    public subjects: Subject[];

    @prop()
    public specialNeeds: string;

    @prop({
        default: null
    })
    public targetHave: boolean;

    @prop({
        default: ''
    })
    public targetOrganization: string;

    @prop({
        default: ''
    })
    public targetDogovor: string;


}
