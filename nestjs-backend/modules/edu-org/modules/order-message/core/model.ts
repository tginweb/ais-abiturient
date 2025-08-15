import {modelOptions, plugin, prop, arrayProp} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from '~lib/db/typegoose/base.model'
import {FileModel} from "~modules/file/core/model";
import {UserModel} from "~modules/user/core/model/user.model";

const autoincrement = require('simple-mongoose-autoincrement');

export class OrderMessageDataMessage {

    @prop()
    public title: string;

    @prop()
    public text: string;

    @arrayProp({ref: FileModel})
    public files: string[];

}

@plugin(paginationPlugin, {
    defaultSortField: 'created',
    defaultSortAscending: false,
    views: {}
})
@plugin(require('mongoose-named-scopes'))
@plugin(autoincrement, {field: 'nid'})
@modelOptions({
    schemaOptions: {
        collection: "edu_order_message",
    }
})
export class EduOrderMessageModel extends BaseModel {

    _id: string;

    @prop()
    nid: number;

    @prop({})
    orderId: string;

    @prop({})
    senderType: string; // client | operator | system

    @prop({ref: UserModel})
    senderUserId?: string;


    @prop({})
    recipientUserId: string;

    @prop({_id: false, default: {}})
    message: OrderMessageDataMessage;

    @prop({})
    context: object;

    @prop({default: false})
    readedByClient: boolean;

    @prop({default: false})
    readedByCompany: boolean;

}
