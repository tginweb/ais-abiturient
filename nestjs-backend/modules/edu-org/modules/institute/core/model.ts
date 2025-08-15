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
            'meta'
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "cl_edu_institute"}})
export class EduInstituteModel extends BaseModel {

    _id: number | string;

    @prop({cfilter: true})
    id: number;

    @prop({})
    name: string;

    @prop({})
    weight: number;

    @prop({})
    meta: object;

    get phone() {
        return this.meta['tel']
    }

    get email() {
        return this.meta['email']
    }

    get active() {
        return this.meta['realfac'] === 't' || this.meta['realfac'] === 'T'
    }
}
