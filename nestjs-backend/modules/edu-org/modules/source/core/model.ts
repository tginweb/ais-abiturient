import {modelOptions, plugin, prop} from "@typegoose/typegoose";
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
@modelOptions({schemaOptions: {collection: "cl_edu_source"}})
export class EduSourceModel extends BaseModel {

    _id: number | string

    @prop({cfilter: true})
    id: number

    @prop({})
    name: string

    @prop({})
    nameShort: string

    isBudget() {
        return this.id !== 3
    }
}
