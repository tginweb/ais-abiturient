import {modelOptions, plugin, prop} from "@typegoose/typegoose";
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
            'name',
            'fields',
            'docRole'
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "edu_achievement"}})
export class EduAchievementTypeModel extends BaseModel {

    _id: ObjectID

    @prop({cfilter: true})
    id: number

    @prop({})
    name: string

    @prop({})
    fields: object

    @prop({})
    docRole: string

    @prop({})
    epguDocTypeId: string


    public get adminUrl() {
        return '/admin/edu/achievement/' + this.id + '/view'
    }

    async getAdminActions() {

        const result = []

        result.push({
            label: 'Просмотр',
            listEvent: 'open',
            type: 'vrouter',
            path: this.adminUrl
        })

        return result
    }
}
