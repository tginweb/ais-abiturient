import {arrayProp, prop, Ref} from "@typegoose/typegoose";

export class OrderChatData {

    @prop()
    public lastMessageDate: Date;

    @prop()
    public messagesCount: number;

    @prop()
    public clientCount: number;

    @prop()
    public companyCount: number;


    @prop()
    public unreadedByClient: number;

    @prop()
    public unreadedByCompany: number;


}

