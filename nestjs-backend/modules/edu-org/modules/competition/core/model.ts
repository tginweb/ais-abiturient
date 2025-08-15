import {modelOptions, plugin, pre, prop} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {ObjectID} from "mongodb";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {EduSourceModel} from "~modules/edu-org/modules/source/core/model";
import {EduFobModel} from "~modules/edu-org/modules/fob/core/model";
import {EduCompetitionModelContext} from "~modules/edu-org/modules/competition/core/model-context";
import {targetOrgsListById} from "~modules/edu-org/enum/target-orgs";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app/model";
import {EduCampaignModel} from "~modules/edu-org/modules/campaign/core";

const autoincrement = require('simple-mongoose-autoincrement');

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
        ],
    }
})
@plugin(autoincrement, {field: 'id'})
@plugin(require('mongoose-named-scopes'))
@modelOptions({
    schemaOptions: {
        collection: "edu_competition",
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
})
@pre<EduCompetitionModel>('save', function () {

})
export class EduCompetitionModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    id: number

    @prop({cfilter: true})
    name: string


    @prop({cfilter: true})
    uid: string

    @prop({cfilter: true})
    clevel: number

    @prop({cfilter: true})
    ccampaign: number

    @prop({cfilter: true})
    cfac: number

    @prop({cfilter: true})
    cfob: number

    @prop({cfilter: true})
    cdirection: number

    @prop({cfilter: true})
    cadmission: number

    @prop({cfilter: true})
    csource: number

    @prop({cfilter: true})
    isdop: boolean

    @prop({cfilter: true, default: 0})
    usedNumber: number

    @prop({cfilter: true})
    admissionNumber: number

    @prop({cfilter: true})
    celevOrg: string


    /* VIRTUALS */
    @prop({ref: () => EduCampaignModel, localField: "ccampaign", foreignField: "id", justOne: true})
    campaign?: EduCampaignModel

    @prop({ref: () => EduAdmissionModel, localField: "cadmission", foreignField: "id", justOne: true})
    admission?: EduAdmissionModel

    @prop({ref: () => EduSourceModel, localField: "csource", foreignField: "id", justOne: true})
    source?: EduSourceModel

    @prop({ref: () => EduFobModel, localField: "cfob", foreignField: "id", justOne: true})
    fob?: EduFobModel

    @prop({ref: () => AbitAppModel, localField: "id", foreignField: "competitionId", justOne: false})
    apps?: AbitAppModel[]

    /* /VIRTUALS */

    public campaignFetched: Boolean
    public admissionFetched: Boolean
    public sourceFetched: Boolean
    public fobFetched: Boolean
    public appsFetched: Boolean

    public context: EduCompetitionModelContext = {}

    public get entityType() {
        return 'edu_competition'
    }

    get admissionNumberTotal() {
        if (this.isdop) {
            return this.admissionNumber
        }
        if (!this.isFinished) {
            return this.admissionNumber
        } else {
            return this.usedNumber
        }
    }

    get celevOrgData() {
        return targetOrgsListById[this.celevOrg]
    }

    get celevOrgName() {
        return this.celevOrgData ? this.celevOrgData.title : null
    }

    get isQuota() {
        return [2,4,5,7,8].indexOf(this.csource) > -1
    }

    get isBudgetCommon() {
        return [1].indexOf(this.csource) > -1
    }

    get isBudget() {
        return [3, 6].indexOf(this.csource) === -1
    }


    getService() {
        return this.context && this.context.service
    }

    get isFinished() {
        return this.isQuota && ([1,2].indexOf(this.clevel) > -1)
    }

    get fisUid() {
        return this.cadmission + '_' + this.sourceSlug
    }

    get sourceSlug() {
        switch (this.csource) {
            case 1:
                return 'budget';
            case 2:
                return 'quota';
            case 3:
                return 'paid';
            case 4:
                return 'target';
            case 5:
                return 'specquota';
        }
    }

    get sourceFisSlug() {
        switch (this.csource) {
            case 1:
                return 'Budget';
            case 2:
                return 'Quota';
            case 3:
                return 'Paid';
            case 4:
                return 'Target';
            case 5:
                return 'SeparateQuota';
        }
    }

    get sourceFisId() {
        switch (this.csource) {
            case 1:
                return 14;
            case 2:
                return 20;
            case 3:
                return 15;
            case 4:
                return 16;
            case 5:
                return 24;
        }
    }

    get fisProgramUid() {
        let fob_code

        switch (this.cfob) {
            case 1:
                fob_code = 'O';
                break;
            case 2:
                fob_code = 'Z';
                break;
            case 3:
                fob_code = 'OZ';
                break;
        }

        let suff = ''

        switch (this.admission.abbr) {
            case 'ЭПАб':
                suff = '_epab'
                break;
            case 'АТПРб':
                suff = '_atprb'
                break;

            case 'аГГМ':
                suff = '_aggm'
                break;
            case 'аМВ':
                suff = '_amb'
                break;
            case 'аМЕТ':
                suff = '_amet'
                break;
            case 'аОБП':
                suff = '_aobp'
                break;
            case 'аТМН':
                suff = '_atmn'
                break;
            case 'аТТГР':
                suff = '_agttr'
                break;
            case 'аНС':
                suff = '_ans'
                break;
            case 'аТПСК':
                suff = '_atpsk'
                break;
            case 'аТХВ':
                suff = '_ahtv'
                break;

            case 'гГП':
                return '21.02.08_O'

            case 'гГПп':
                return '21.02.08_O'

            case 'мТМТ':
                return '15.02.08_O'

        }

        if (this.csource === 4 && this.celevOrg) {
            return this.admission.direction ? this.admission.direction.cod + '_' + fob_code + suff + '_' + this.celevOrg : ''
        } else {
            return this.admission.direction ? this.admission.direction.cod + '_' + fob_code + suff : ''
        }
    }

    async getCampaign(refetch = false): Promise<EduCampaignModel> {
        if (!this.campaign && !this.campaignFetched || refetch) {
            this.campaign = await this.getService().serviceEduCampaign.query().withViewPublic().getByNid(this.ccampaign)
            this.campaignFetched = true
        }
        if (this.campaign && this.getService()) {
            this.campaign.addContext(this.getService().serviceEduCampaign.modelContext())
        }
        return this.campaign
    }

    async getAdmission(refetch = false): Promise<EduAdmissionModel> {

        if (!this.admission && !this.admissionFetched || refetch) {
            this.admission = await this.getService().serviceEduAdmission.query().withViewPublic().getByNid(this.cadmission)
            this.admissionFetched = true
        }

        if (this.admission && this.getService()) {
            this.admission.addContext(this.getService().serviceEduAdmission.modelContext())
        }
        return this.admission
    }

    async getApps(): Promise<AbitAppModel[]> {
        if (!this.apps) {
            this.apps = await this.getService().appService.query().where({competitionId: this.id}).withViewPublic().execMany()
        } else if (!this.appsFetched) {
            this.apps.forEach(app => app.addContext(this.getService().appService.modelContext()))
            this.appsFetched = true
        }
        return this.apps
    }

    async getSource(refetch = false): Promise<EduSourceModel> {
        if (!this.source && !this.sourceFetched || refetch) {
            this.source = await this.getService().serviceEduSource.query().getByNid(this.csource)
            this.sourceFetched = true
        }
        return this.source
    }

    async getMembers() {

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
            path: '/admin/edu/competition/' + this._id + '/view',
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
                    label: 'Отправить КС',
                    confirm: true,
                    type: 'dispatch',
                    path: 'edu_epgu_message/apiMutate',
                    argsIdMultiple: true,
                    args: {
                        mutation: 'createFromEntity',
                        messageType: 'RankedCompetitionListPackage',
                        entityType: 'edu_competition',
                    },
                },
                {
                    group: true,
                    label: 'Отправить на ЕПГУ - ADD',
                    confirm: true,
                    type: 'dispatch',
                    path: 'edu_epgu_message/apiMutate',
                    argsIdMultiple: true,
                    args: {
                        mutation: 'createFromEntities',
                        messageType: 'CompetitionAdd',
                        entityType: 'edu_competition',
                    },
                },
                {
                    group: true,
                    label: 'Отправить на ЕПГУ - EDIT',
                    confirm: true,
                    type: 'dispatch',
                    path: 'edu_epgu_message/apiMutate',
                    argsIdMultiple: true,
                    args: {
                        mutation: 'createFromEntities',
                        messageType: 'CompetitionEdit',
                        entityType: 'edu_competition',
                    },
                },
                {
                    group: true,
                    label: 'Отправить ВИ - ADD',
                    confirm: true,
                    type: 'dispatch',
                    path: 'edu_epgu_message/apiMutate',
                    argsIdMultiple: true,
                    args: {
                        mutation: 'createFromEntities',
                        messageType: 'EntranceTestListAdd',
                        entityType: 'edu_competition',
                        split: 10
                    },
                }
            ],
        })

        result.push({
            id: 'fis',
            label: 'ФИС',
            roles: ['admin'],
            group: true,
            children: [
                 {
                    group: true,
                    label: 'Отправить в ФИС',
                    confirm: true,
                    type: 'dispatch',
                    path: 'edu_fis_message/apiMutate',
                    argsIdMultiple: true,
                    args: {
                        mutation: 'createFromEntities',
                        messageType: 'CompetitionUpdate',
                        entityType: 'edu_competition',
                    },
                },
                {
                    group: true,
                    label: 'Отправить программу',
                    confirm: true,
                    type: 'dispatch',
                    path: 'edu_fis_message/apiMutate',
                    argsIdMultiple: true,
                    args: {
                        mutation: 'createFromEntities',
                        messageType: 'CompetitionProgramUpdate',
                        entityType: 'edu_competition',
                    },
                },
            ],
        })

        return result
    }

    getAppFields() {
        return {
            competitionId: this.id,
            competitionUid: this.uid,
            cadmission: this.cadmission,
            csource: this.csource,
            cfob: this.cfob,
            cfac: this.cfac,
        }
    }
}
