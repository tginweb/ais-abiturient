import {modelOptions, plugin, pre, prop} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from '~lib/db/typegoose/base.model'
import {ObjectID} from "mongodb";

const autoincrement = require('simple-mongoose-autoincrement');

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: true,
    views: {
        public: [
            '_id',
            'id',
            'name',
            'nameShort'
        ],
    }
})
@plugin(autoincrement, {field: 'id'})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "cl_edu_order_type"}})
@pre<AbitOrderTypeModel>('save', function () {

})
export class AbitOrderTypeModel extends BaseModel {

    _id: ObjectID

    @prop({cfilter: true})
    id: number

    @prop({cfilter: true})
    name: string

    @prop({cfilter: true})
    nameShort: string
}
