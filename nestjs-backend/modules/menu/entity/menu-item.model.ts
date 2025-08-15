import {arrayProp, modelOptions, plugin, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from '~lib/db/typegoose/base.model'

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
            'name',
            'type',
            'sourceIds'
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({
    schemaOptions: {
        collection: "epgu_packet",
    }
})
export class MenuItemModel extends BaseModel {

    _id: number | string;

    @prop({cfilter: true})
    id: number;

    @prop({})
    code: string;

    @prop({})
    parentId: string;

    @prop({})
    url: string;

    @prop({})
    label: string;
}
