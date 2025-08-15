import {modelOptions, plugin, pre, prop, arrayProp} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {ObjectID} from "mongodb";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core/model";
import {AppStatusEnum, appStatusListById} from "~modules/edu-org/modules/abit/core/app/enum";
import {ItemApplication} from "~modules/edu-org/modules/abit/core/order/subdoc/applications/item-application";

const autoincrement = require('simple-mongoose-autoincrement');

export class EpguCompetitionGroup {
    @prop({cfilter: true})
    createAt: Date

    @prop({cfilter: true})
    competitionUid: string

    @prop({cfilter: true})
    statusId: AppStatusEnum

    @prop({cfilter: true})
    priorityTarget: number

    @prop({cfilter: true})
    priorityOther: number

    @prop({ref: () => EduCompetitionModel, localField: "competitionUid", foreignField: "uid", justOne: true})
    competition: EduCompetitionModel

    get hash() {
        return this.statusId + '.' + this.priority
    }

    get priority() {
        return this.priorityOther ? this.priorityOther : this.priorityTarget
    }

    get status() {
        return appStatusListById[this.statusId] ? appStatusListById[this.statusId] : null
    }

    get isCanceled() {
        return appStatusListById[this.statusId] ? appStatusListById[this.statusId].canceled : null
    }
}

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
            'uid',
            'yr',
            'name',
            'cadmission',
            'cdirection',
            'cfob'
        ],
    }
})
@plugin(autoincrement, {field: 'id'})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "edu_ss_app"}})
@pre<EduSSAppModel>('save', function () {

})
export class EduSSAppModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    nid: number

    @prop({cfilter: true})
    guid: string

    @prop({cfilter: true})
    guidEntrant: string

    @prop({cfilter: true})
    entrantId: string

    @prop({cfilter: true})
    fio: string

    @prop({cfilter: true})
    snils: string

    @prop({})
    isBudget: boolean

    @prop({})
    registrationDate: Date

    @arrayProp({items: EpguCompetitionGroup})
    apps: EpguCompetitionGroup[]

    @prop({})
    fields: object

    @prop({cfilter: true})
    stageAdmissionId: number



    /* VIRTUALS */


    /* /VIRTUALS */


    // @ts-ignore
    public get entityType() {
        return 'edu_ss_app'
    }

    get isDopnabor() {
        return this.stageAdmissionId === 4
    }

    async getAdminActions(user) {

        const result = []

        result.push({
            name: 'view',
            label: 'Просмотр',
            icon: 'fasEye',
            listEvent: 'open',
            type: 'vrouter',
            rowRoot: true,
            path: '/admin/edu/order/' + this._id + '/view',
            access: true
        })

        result.push({
            id: 'epgu',
            name: 'epgu',
            label: 'ЕПГУ',
            roles: ['admin'],
            group: true,
            access: true,
            children: [
                {
                    group: true,
                    label: 'Get',
                    confirm: true,
                    type: 'dispatch',
                    path: 'edu_epgu_message/apiMutate',
                    argsIdMultiple: true,
                    args: {
                        mutation: 'createFromEntity',
                        messageType: 'SSAppGet',
                        entityType: 'edu_ss_app',
                    },
                },
                {
                    group: true,
                    label: 'Set status',
                    confirm: true,
                    type: 'dispatch',
                    path: 'edu_epgu_message/apiMutate',
                    argsIdMultiple: true,
                    args: {
                        mutation: 'createFromEntity',
                        messageType: 'SSAppStatusSet',
                        entityType: 'edu_ss_app',
                    },
                },
                {
                    group: true,
                    label: 'Set status multiple',
                    confirm: true,
                    type: 'dispatch',
                    path: 'edu_epgu_message/apiMutate',
                    argsIdMultiple: true,
                    args: {
                        mutation: 'createFromEntities',
                        messageType: 'SSAppStatusSetMultiple',
                        entityType: 'edu_ss_app',
                    },
                },
            ],
        })


        return result.filter(item => {

            if (item.roles && item.roles.length && !item.roles.filter(value => user.roles.includes(value)).length) return false

            return item.access
        })
    }


}
