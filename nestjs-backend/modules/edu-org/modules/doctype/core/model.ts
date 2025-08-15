import {arrayProp, modelOptions, plugin, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from '~lib/db/typegoose/base.model'

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'nid',
            'name',
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "cl_edu_doctype"}})
export class EduDoctypeModel extends BaseModel {

    _id: number | string;

    @prop({cfilter: true})
    nid: number;

    @prop({})
    name: string;
}
