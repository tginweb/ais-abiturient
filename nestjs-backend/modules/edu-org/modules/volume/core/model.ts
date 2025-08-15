import {modelOptions, plugin, pre, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {ObjectID} from 'mongodb'
import {EduDirectionModel} from "~modules/edu-org/modules/direction/core/model";
import {EduLevelModel} from "~modules/edu-org/modules/level/core/model";
import {EduCampaignModel} from "~modules/edu-org/modules/campaign/core/model";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";
import {EduVolumeDistributionModel} from "./model/distribution";

const autoincrement = require('simple-mongoose-autoincrement');

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
            'uid',
            'name',
            'cdirection',
            'ccampaign',
            'clevel',
            'budgetO',
            'budgetOZ',
            'budgetZ',
            'quotaO',
            'quotaOZ',
            'quotaZ',
            'targetO',
            'targetOZ',
            'targetZ',

            'otdelO',
            'otdelOZ',
            'otdelZ',
        ],
    }
})
@plugin(autoincrement, {field: 'id'})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "edu_volume"}})
@pre<EduVolumeModel>('save', function () {
    this.uid = [this.yr, this.cdirection].join('.')
})
export class EduVolumeModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    id: number

    @prop({cfilter: true})
    yr: number

    @prop({cfilter: true})
    uid: string

    @prop({})
    name: string

    @prop({cfilter: true})
    cdirection: number

    @prop({cfilter: true})
    ccampaign: number

    @prop({cfilter: true})
    clevel: number

    @prop({})
    budgetO: number

    @prop({})
    budgetOZ: number

    @prop({})
    budgetZ: number

    @prop({})
    quotaO: number

    @prop({})
    quotaOZ: number

    @prop({})
    quotaZ: number

    @prop({})
    targetO: number

    @prop({})
    targetOZ: number

    @prop({})
    targetZ: number

    @prop({})
    otdelO: number

    @prop({})
    otdelOZ: number

    @prop({})
    otdelZ: number

    @prop({})
    paidO: number

    @prop({})
    paidOZ: number

    @prop({})
    paidZ: number

    @prop({type: EduVolumeDistributionModel})
    distributions?: EduVolumeDistributionModel[]

    @prop({ref: EduDirectionModel, localField: "cdirection", foreignField: "id", justOne: true})
    public direction?: EduDirectionModel;

    @prop({ref: EduLevelModel, localField: "clevel", foreignField: "id", justOne: true})
    public level?: Ref<EduLevelModel>;

    @prop({ref: EduCampaignModel, localField: "ccampaign", foreignField: "id", justOne: true})
    public campaign?: Ref<EduCampaignModel>

    public get entityType() {
        return 'edu_volume'
    }

    async actionFill() {
        await this.fillDistributions()
        await this.savePromise()
        return true
    }

    async fillDistributions() {

        const types = [
            {levelBudget: 1, name: 'федеральный'},
        ]

        const volume = this

        for (const type of types) {

            let subdoc = this.findSubdoc<EduVolumeDistributionModel>(this.distributions, {
                clevelBudget: type.levelBudget
            })

            if (!subdoc) {
                subdoc = <EduVolumeDistributionModel>{
                    id: type.levelBudget,
                    clevelBudget: type.levelBudget,
                }
            }

            const name = [
                volume.name,
                type.name,
            ]

            Object.assign(subdoc, {
                name: name.join(', '),
                budgetO: volume.budgetO,
                budgetOZ: volume.budgetOZ,
                budgetZ: volume.budgetZ,
                quotaO: volume.quotaO,
                quotaOZ: volume.quotaOZ,
                quotaZ: volume.quotaZ,
                targetO: volume.targetO,
                targetOZ: volume.targetOZ,
                targetZ: volume.targetZ,
                paidO: volume.paidO,
                paidOZ: volume.paidOZ,
                paidZ: volume.paidZ,
            })

            if (!subdoc._id)
                this.distributions.push(subdoc)
        }
    }

    async epguExchange(taskId, op, scope = 'self', ids = '*') {
        console.log([taskId, op, scope, ids])


    }

    async epguPacket_DistributedAdmissionVolume_Sync(entity) {

        let data = {}

        console.log(entity)

        const volume = entity.getSubdocRoot()

        data['Uid'] = volume.uid + '.' + entity.id
        data['UidAdmissionVolume'] = volume.uid
        data['IdDirection'] = volume.direction ? await this.context.epguDictionaryService.getTermIdByOkso(volume.direction['cod']) : null
        data['IdLevelBudget'] = entity.clevelBudget

        data['BudgetO'] = entity.budgetO
        data['BudgetOz'] = entity.budgetOZ
        data['BudgetZ'] = entity.budgetZ

        data['QuotaO'] = entity.quotaO
        data['QuotaOz'] = entity.quotaOZ
        data['QuotaZ'] = entity.quotaZ

        data['TargetO'] = entity.targetO
        data['TargetOz'] = entity.targetOZ
        data['TargetZ'] = entity.targetZ

        data['PaidO'] = entity.paidO
        data['PaidOz'] = entity.paidOZ
        data['PaidZ'] = entity.paidZ

        return {
            'DistributedAdmissionVolume': data
        }
    }

    async epguPacket_AdmissionVolume_Sync(entity) {

        let data = {}

        data['Uid'] = entity.uid
        data['UidCampaign'] = this.campaign['uid']
        data['IdDirection'] = this.direction ? await this.context.epguDictionaryService.getTermIdByOkso(this.direction['cod']) : null
        data['IdEducationLevel'] = await this.context.epguDictionaryService.getTermIdByAis('EducationLevel', this.clevel)

        data['BudgetO'] = this.budgetO
        data['BudgetOz'] = this.budgetOZ
        data['BudgetZ'] = this.budgetZ

        data['QuotaO'] = this.quotaO
        data['QuotaOz'] = this.quotaOZ
        data['QuotaZ'] = this.quotaZ

        data['TargetO'] = this.targetO
        data['TargetOz'] = this.targetOZ
        data['TargetZ'] = this.targetZ

        data['PaidO'] = this.paidO
        data['PaidOz'] = this.paidOZ
        data['PaidZ'] = this.paidZ

        return {
            'AdmissionVolume': data
        }
    }

    async epguPacket_OrgDirection_Sync(entity) {

        let data = {}

        data['Uid'] = this.direction['cod']
        data['IdDirection'] = this.direction ? await this.context.epguDictionaryService.getTermIdByOkso(this.direction['cod']) : null

        return {
            'OrgDirection': data
        }
    }

    async getSubdocsTree() {

        const res = []

        res.push({
            key: this.entityType + '.distribution:' + this.id,
            label: 'Уровни бюджета',
            children: this.distributions.map(doc => doc.getTreeNode())
        })

        return res
    }

    async getAdminActions() {

        const result = []

        result.push({
            label: 'Просмотр',
            listEvent: 'open',
            type: 'vrouter',
            path: 'fss'
        })

        result.push({
            label: 'Заполнить',
            confirm: true,
            type: 'dispatch',
            path: 'edu_volume/entityAction',
            params: {
                action: 'fill'
            }
        })

        result.push({
            label: 'Удалить',
            confirm: true,
            type: 'dispatch',
            path: 'edu_volume/entityAction',
            params: {
                action: 'delete'
            }
        })

        return result
    }

    public get fisEducationLevelID() {
        switch (this.clevel) {
            case 1: return 5;
            case 2: return 2;
            case 3: return 4;
            case 4: return 17;
            case 5: return 21;
        }
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
                        messageType: 'VolumeUpdate',
                        entityType: 'edu_volume',
                    },
                },
            ],
        })

        return result
    }

}
