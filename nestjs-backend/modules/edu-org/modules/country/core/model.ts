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
            'title',
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "cl_edu_country"}})
export class EduCountryModel extends BaseModel {

    _id: number | string;

    @prop({cfilter: true})
    nid: number;

    @prop({})
    title: string;

    @prop({cfilter: true})
    epguId: number;

    @prop({cfilter: true})
    aisId: number;
}
