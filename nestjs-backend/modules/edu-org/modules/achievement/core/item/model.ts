import {modelOptions, plugin, prop} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from '~lib/db/typegoose/base.model'
import {ObjectID} from "mongodb";
import {EduDocModel} from "~modules/edu-org/modules/doc/core/model";
import {EduAchievementTypeModel} from "~modules/edu-org/modules/achievement/core/type";
import {EduAchievementItemContext} from "~modules/edu-org/modules/achievement/core/item/model-context";


@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
            'name',
            'fields',
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "edu_achievement_item"}})
export class EduAchievementItemModel extends BaseModel {

    _id: ObjectID

    @prop({cfilter: true})
    nid: number

    @prop({cfilter: true})
    orderId: string

    @prop({cfilter: true})
    typeId: number

    @prop({default: ''})
    desc: string

    @prop({cfilter: true})
    docId: string

    @prop({ref: () => EduDocModel, localField: "docId", foreignField: "_id", justOne: true})
    doc: EduDocModel

    @prop({ref: () => EduAchievementTypeModel, localField: "typeId", foreignField: "id", justOne: true})
    type: EduAchievementTypeModel

    public context: EduAchievementItemContext = {}


    get id() {
        return this._id.toString()
    }

    get abitCanEdit() {
        return true
    }

    get abitCanDelete() {
        return true
    }

    getService() {
        return this.context.service
    }

    async getTypeDoc(): Promise<EduAchievementTypeModel> {
        if (!this.type) {
            this.type = await this.getService().achievementService.query().where({id: this.typeId}).withRequired().execOne()
        }
        return this.type
    }

    async getDocDoc(): Promise<EduDocModel> {
        if (!this.doc) {
            this.doc = await this.getService().docService.query().where({_id: this.docId}).withRequired().execOne()
        }
        return this.doc
    }
}
