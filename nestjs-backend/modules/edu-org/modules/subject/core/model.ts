import {modelOptions, plugin, prop} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from '~lib/db/typegoose/base.model'
import {ObjectID} from "mongodb";

export class EduSubjectTestLocationModel {

    @prop({cfilter: true})
    public id: number

    @prop({cfilter: true})
    public cadmission: number[]

    @prop({cfilter: true})
    public uid: string

    @prop({cfilter: true})
    public place: string

    @prop({cfilter: true})
    public date: Date

    @prop({cfilter: true})
    public epguId: Date
}


@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
            'name',
            'isege',
            'epguId',
            'locations'
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "cl_edu_subject"}})
export class EduSubjectModel extends BaseModel {

    _id: ObjectID

    @prop({cfilter: true})
    id: number

    @prop({})
    name: string

    @prop({})
    isege: string

    @prop({})
    alternative: string

    @prop({})
    fisid: number

    @prop({})
    epguId: number

    @prop({type: EduSubjectTestLocationModel})
    locations?: EduSubjectTestLocationModel[]

    public get adminUrl() {
        return '/admin/edu/subject/' + this.id + '/view'
    }

    get isEge() {
        return this.isege === 't'
    }

    async getAdminActions() {

        const result = []

        result.push({
            label: 'Просмотр',
            listEvent: 'open',
            rowRoot: true,
            icon: 'view',
            type: 'vrouter',
            path: this.adminUrl
        })

        return result
    }
}
