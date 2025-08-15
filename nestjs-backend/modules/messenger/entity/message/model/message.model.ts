import {prop, modelOptions, plugin, getModelForClass} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from '~lib/db/typegoose/base.model'


@plugin(paginationPlugin, {
    defaultSortField: 'created',
    defaultSortAscending: false,
    views: {
        default: [],
        public: [],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({
    schemaOptions: {
        collection: "message",
        discriminatorKey: "type"
    }
})
export class MessageModel extends BaseModel {

    @prop()
    _id: Number | string;

    @prop({})
    created: number | string | Date;

    @prop({})
    relDocType: string;

    @prop({})
    relDocId: string;

    @prop({})
    message: string;

    @prop({})
    senderType: string;

    @prop({})
    senderId: string;

    @prop({})
    recipientId: string;
}
