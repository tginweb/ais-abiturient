import {modelOptions, plugin, prop} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from '~lib/db/typegoose/base.model'

const autoincrement = require('simple-mongoose-autoincrement');

@plugin(paginationPlugin, {
    defaultSortField: 'created',
    defaultSortAscending: false,
    views: {}
})
@plugin(require('mongoose-named-scopes'))
@plugin(autoincrement, {field: 'nid'})
@modelOptions({
    schemaOptions: {
        collection: "entity_event",
    }
})
export class EntityEventModel extends BaseModel {

    _id: string

    @prop({cfilter: true})
    id: number

    @prop({})
    relEntityType: string

    @prop({})
    relEntityId: string

    @prop({})
    eventType: string

    @prop({})
    eventData: object
}
