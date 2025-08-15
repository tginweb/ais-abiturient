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
            'uid',
            'name',
            'cpriemState',
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "edu_campaign"}})
export class EduCampaignModel extends BaseModel {

    _id: number | string;

    @prop({cfilter: true})
    id: number;

    @prop({cfilter: true})
    uid: string

    @prop({})
    name: string;

    @prop({})
    cpriemState: number;

    get fisUid() {
       return '2023_' + this.id
    }

}
