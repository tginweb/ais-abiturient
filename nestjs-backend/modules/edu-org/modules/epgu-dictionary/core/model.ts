import {arrayProp, modelOptions, plugin, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from '~lib/db/typegoose/base.model'
import {ObjectID} from "mongodb";

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
            'taxonomy',
            'actual',
            'name',
            'fields',
            'aisId'
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({
    schemaOptions: {
        collection: "epgu_dictionary",
        toObject: {virtuals: true},
    }
})
export class EduEpguDictionaryModel extends BaseModel {

    _id: ObjectID

    @prop({cfilter: true})
    id: number

    @prop({cfilter: true})
    taxonomy: string

    @prop({cfilter: true})
    actual: boolean

    @prop({cfilter: true})
    name: string

    @prop({
        _id: false,
        default: {}
    })
    fields: object

    @prop({cfilter: true})
    aisId: number
}
