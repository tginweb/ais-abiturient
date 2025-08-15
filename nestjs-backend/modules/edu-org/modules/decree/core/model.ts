import {arrayProp, modelOptions, plugin, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from '~lib/db/typegoose/base.model'
import {EduCampaignModel} from "~modules/edu-org/modules/campaign/core";
const autoincrement = require('simple-mongoose-autoincrement');

const dayjs = require('dayjs')

@plugin(paginationPlugin, {
    defaultSortField: 'nid',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
            'nid',
            'uid',
            'name',
            'aisNumber',
            'aisId',
            'pubDate',
            'ccampaign'
        ],
    }
})
@plugin(autoincrement, {field: 'nid'})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "edu_decree"}})
export class EduDecreeModel extends BaseModel {

    _id: number | string;

    @prop({cfilter: true})
    nid: number

    @prop({cfilter: true})
    uid: string

    @prop({})
    name: string

    @prop({})
    aisNumber: string

    @prop({})
    aisId: number

    @prop({})
    pubDate: Date

    @prop({})
    ccampaign: number

    @prop({ref: EduCampaignModel, localField: "ccampaign", foreignField: "id", justOne: true})
    campaign?: EduCampaignModel

    get nameFull() {
        return [
            this.name,
            this.aisNumber ? '№ ' + this.aisNumber : null,
            'от ' + dayjs(this.pubDate).format('DD.MM.YYYY')
        ].filter(v => !!v).join(', ')
    }

    get id() {
        return this._id.toString()
    }

    async getActions() {

        const result = []

        result.push({
            id: 'fis',
            label: 'ФИС',
            icon: 'view',
            group: true,
            children: [
                {
                    label: 'Синхронизировать',
                    confirm: true,
                    group: true,
                    type: 'dispatch',
                    path: 'edu_fis_message/apiMutate',
                    argsIdMultiple: true,
                    args: {
                        mutation: 'createFromEntities',
                        messageType: 'DecreeUpdate',
                        entityType: 'edu_decree',
                    },
                },
            ],
        })

        return result
    }

}
