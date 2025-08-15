import {modelOptions, plugin, pre, prop} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {ObjectID} from "mongodb";
import {FileModel} from "~modules/file/core/model";
import {EduDocRoleEnum, EduDocRolesMap, EduDocStatusEnum, EduDocStatusMap} from "./enum";
import {EduEpguDictionaryModel} from "~modules/edu-org/modules/epgu-dictionary/core/model";
import {AbitWorkplaceEnum, AbitWorkplaceMap} from "~modules/edu-org/enum/source-workplace";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";

const autoincrement = require('simple-mongoose-autoincrement');

export class EduDocModelEpgu {
    @prop()
    public guid: string

    @prop()
    public fui: string

    @prop({default: {}, _id: false})
    public data: object
}

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
            'nid',
            'name',
            'orderId',

            'type',
            'achievementTypeId',
            'lgotTypeId',

            'docTypeId',
            'docCategoryId',

            'docName',
            'docSeries',
            'docNumber',
            'docOrg',
            'issueDate',
            'fields',
            'files',
            'createAt',
            'updateAt'
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@plugin(autoincrement, {field: 'nid'})
@modelOptions({schemaOptions: {collection: "edu_doc"}})
@pre<EduDocModel>('save', async function () {
    if (!this.sid) {
        this.sid = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
    }
})
export class EduDocModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    nid: number

    @prop({})
    sid: string

    @prop({})
    orderId: string

    @prop({})
    type: EduDocRoleEnum

    @prop({})
    isMain: boolean

    @prop({default: EduDocStatusEnum.NEW})
    statusId: EduDocStatusEnum


    @prop({})
    docCategoryId: number

    @prop({})
    docTypeId: number

    @prop({default: ''})
    docName: string

    @prop({default: ''})
    docSeries: string

    @prop({default: ''})
    docNumber: string

    @prop({default: ''})
    docOrg: string


    @prop({})
    issueDate: string

    @prop({default: {}, _id: false})
    fields: object

    @prop({default: []})
    files: string[]

    @prop({cfilter: true})
    createSource: AbitWorkplaceEnum

    @prop({})
    achievementTypeId: number

    @prop({
        ref: () => EduEpguDictionaryModel,
        localField: "docCategoryId",
        foreignField: "id",
        justOne: true,
        match: {taxonomy: 'DocumentCategoryCls'}
    })
    docCategory: EduEpguDictionaryModel

    @prop({
        ref: () => EduEpguDictionaryModel,
        localField: "docTypeId",
        foreignField: "id",
        justOne: true,
        match: {taxonomy: 'DocumentTypeCls'}
    })
    docType: EduEpguDictionaryModel

    @prop({ref: () => FileModel, localField: "files", foreignField: "_id", justOne: false})
    filesDocs: FileModel[]

    @prop({ref: () => AbitOrderModel, localField: "orderId", foreignField: "_id", justOne: true})
    order: AbitOrderModel


    @prop({default: false})
    deleted: boolean

    @prop({_id: false, default: {}})
    epgu: EduDocModelEpgu

    get id() {
        return this._id.toString()
    }

    get roleInfo() {
        return EduDocRolesMap[this.type]
    }

    get typeName() {
        return this.roleInfo ? this.roleInfo.title : null
    }

    getOkcmId() {
        return this.fields['IdOksm'] || 185
    }

    get subdivisionCode(): string {
        return this.fields['SubdivisionCode'] || ''
    }

    get subdivisionCodeFormatted() {
        if (this.subdivisionCode.match('000-')) {
            return null
        }
        return this.subdivisionCode ? this.subdivisionCode.replace(/[^\d]/g, '').match(/.{1,3}/g).filter(v => !!v).join('-') : ''
    }

    get docTypeName() {

        let name
        if (this.roleInfo) {
            if (this.roleInfo.epgu) {
                name = this.docType ? this.docType.name : null
            } else {
                name = this.docName || this.roleInfo.title
            }
        }
        if (!name) {
            if (this.docName)
                name = this.docName
            else
                name = 'Документ №' + this.nid
        }
        return name
    }

    get downloadPdfUrl() {
        return '/api/doc/downloadPdf?sid=' + this.sid
    }

    get createSourceInfo() {
        return AbitWorkplaceMap[this.createSource]
    }


    get canDeleteAbit() {
        if (!this.roleInfo.canDelete)
            return false

        if (
            this.epgu.guid ||
            (this.statusId !== EduDocStatusEnum.NEW) ||
            (this.createSource !== AbitWorkplaceEnum.CIS_ABIT)
        )
            return true

        return true
    }

    get canDeleteAdmin() {
        if (!this.roleInfo.canDelete) {
            return false
        }

        if (
            !this.epgu.guid &&
            (
                this.statusId === EduDocStatusEnum.NEW ||
                this.statusId === EduDocStatusEnum.PENDING
            )
        ) return true;

        return false
    }

    get status() {
        return EduDocStatusMap[this.statusId]
    }

    setOrder(order) {
        this.order = order
    }

    get printComponent() {
        switch (this.type) {
            case EduDocRoleEnum.OPIS:
                return 'tpl-print-opis'
            case EduDocRoleEnum.CONSENT:
                return 'tpl-print-consent'
            case EduDocRoleEnum.RASPISKA:
                return 'tpl-print-raspiska'
            case EduDocRoleEnum.KVITOK:
                return 'tpl-print-kvitok'
            case EduDocRoleEnum.CONSENT_DIST:
                return 'tpl-print-consent-dist'
            case EduDocRoleEnum.APP:
                if (this.order) {
                    return this.order.getPrintComponentApp()
                }
                break
        }
    }

    getRoleByTypeId() {


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
            path: '/admin/edu/doc/' + this.id + '/edit',
            access: true
        })

        result.push({
            id: 'epgu',
            label: 'ЕПГУ',
            roles: ['admin'],
            group: true,
            children: [
                {
                    group: true,
                    label: 'Get',
                    confirm: true,
                    type: 'dispatch',
                    path: 'edu_epgu_message/apiMutate',
                    argsIdMultiple: true,
                    args: {
                        mutation: 'createFromEntities',
                        messageType: 'DocumentListGetMultiple',
                        entityType: 'edu_doc',
                        split: 200
                    },
                },
                {
                    group: true,
                    label: 'File get',
                    confirm: true,
                    type: 'dispatch',
                    path: 'edu_doc/action',
                    argsIdMultiple: true,
                    args: {
                        action: 'epguFileGet',
                    },
                },
            ],
        })

        return result
    }

}
