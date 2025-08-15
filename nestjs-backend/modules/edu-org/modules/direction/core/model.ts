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
            'cod',
            'name',
            'code'
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "cl_edu_direction"}})
export class EduDirectionModel extends BaseModel {

    _id: number | string;

    @prop({cfilter: true})
    id: number;

    @prop({})
    cod: string;

    @prop({})
    name: string;

    @prop({})
    cperson: string;

    @prop({})
    cugspec: string;

    @prop({})
    dubl: string;

    @prop({})
    cpnr: string;

    @prop({})
    abbr: string;

    @prop({})
    cspeczvanie: string;

    @prop({})
    cspecprice: string;

    @prop({})
    code: string;

    @prop({})
    deprecated: string;

    @prop({})
    name_en: string;

}
