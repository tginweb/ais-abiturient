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
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "cl_edu_quota_type"}})
export class EduQuotaTypeModel extends BaseModel {

    _id: number | string;

    @prop({cfilter: true})
    id: number;

    @prop({})
    name: string;
}
