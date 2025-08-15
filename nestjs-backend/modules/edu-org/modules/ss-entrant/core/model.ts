import {modelOptions, plugin, pre, prop} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {ObjectID} from "mongodb";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";
import {EduSSEntrantEpguDoc} from "./model/epgu-doc";
import {EduInstituteModel} from "~modules/edu-org/modules/institute/core/model";
import {UserModel} from "~modules/user/core/model/user.model";
import {abitOrderStatusList} from "~modules/edu-org/modules/abit/core/order/statics/status";

const autoincrement = require('simple-mongoose-autoincrement');

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
@modelOptions({schemaOptions: {collection: "edu_ss_entrant"}})
@pre<EduSSEntrantModel>('save', function () {

})
export class EduSSEntrantModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    id: number

    @prop({cfilter: true})
    epguId: number

    @prop({cfilter: true})
    isdop: boolean

    @prop({cfilter: true})
    guid: string

    @prop({cfilter: true})
    orderId: string[]

    @prop({cfilter: true})
    orderNid: number[]

    @prop({cfilter: true})
    aisId: number[]

    @prop({cfilter: true})
    firstName: string

    @prop({cfilter: true})
    secondName: string

    @prop({cfilter: true})
    lastName: string

    @prop({cfilter: true})
    genderId: number

    @prop({cfilter: true})
    fio: string

    @prop({cfilter: true})
    snils: string

    @prop({cfilter: true})
    egeRes: object

    @prop({type: EduSSEntrantEpguDoc})
    epguDocs: EduSSEntrantEpguDoc[]

    @prop({cfilter: true})
    cfac: number

    @prop({cfilter: true})
    changedEpgu: boolean

    @prop({cfilter: true})
    changedAis: boolean


    @prop({cfilter: true})
    fields: object


    @prop({cfilter: true})
    fieldsJson: string

    @prop({cfilter: true})
    dateRegister: Date

    @prop({cfilter: true})
    coperator?: string

    @prop({cfilter: true})
    status: string

    @prop({cfilter: true})
    comments: object

    @prop({cfilter: true})
    haveExams: boolean

    @prop({cfilter: true})
    createSource: string

    @prop({ref: () => EduInstituteModel, localField: "cfac", foreignField: "id", justOne: true})
    fac?: EduInstituteModel

    @prop({ref: () => UserModel, localField: "coperator", foreignField: "_id", justOne: true})
    operator?: UserModel


    public get entityType() {
        return 'edu_ss_entrant'
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
            id: 'admin',
            name: 'admin',
            label: 'Администрирование',
            roles: ['admin'],
            group: true,
            access: true,
            children: [
                {
                    group: true,
                    label: 'Import',
                    confirm: true,
                    type: 'dispatch',
                    path: 'edu_ss_entrant/entityActionMultiple',
                    argsIdMultiple: true,
                    args: {
                        name: 'import',
                    },
                },
            ],
        })

        result.push({
            label: 'Get originals',
            confirm: true,
            group: true,
            type: 'dispatch',
            path: 'edu_epgu_message/apiMutate',
            argsIdMultiple: true,
            args: {
                mutation: 'createFromEntities',
                messageType: 'OriginalEducationDocumentList',
                entityType: 'edu_ss_entrant',
                split: 199
            },
        })

        return result
    }

    get statusInfo() {
        return abitOrderStatusList[this.status]
    }

}
