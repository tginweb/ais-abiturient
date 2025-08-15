import {Injectable} from '@nestjs/common'
import {EduAisService} from "~modules/edu-ais/edu-ais.service"
import {EduAdmissionService} from "../../admission/core/service"
import {EduDirectionService} from "../../direction/core/service"
import {EduVolumeModel as Model} from "./../core/model"
import {EduVolumeService as ModelCoreService} from "./../core/service"
import {EduAdminService} from "~modules/edu-org/admin/service";
import {EntityService} from "~modules/entity/entity.service";
import {EduLevelService} from "~modules/edu-org/modules/level/core/service";
import {EduFobService} from "~modules/edu-org/modules/fob/core/service";
import {EduCampaignService} from "~modules/edu-org/modules/campaign/core/service";
import {EduCompetitionService} from "~modules/edu-org/modules/competition/core";


@Injectable()
export class EduVolumeAdminService {

    constructor(
        private readonly coreService: ModelCoreService,
        private readonly aisService: EduAisService,
        private readonly admissionService: EduAdmissionService,
        private readonly directionService: EduDirectionService,
        private readonly entityService: EntityService,
        private readonly eduAdminService: EduAdminService,
        private readonly serviceEduLevel: EduLevelService,
        private readonly serviceEduFob: EduFobService,
        private readonly serviceEduCampaign: EduCampaignService,
        private readonly competitionService: EduCompetitionService,
    ) {
        this.entityService.entityTypeAddContext('edu_volume', this.eduAdminService.getContext())
    }

    async getFiltersTree(): Promise<any> {

        const eduLevels = await this.serviceEduLevel.find()
        const eduCampaigns = await this.serviceEduCampaign.find()
        const eduFobs = await this.serviceEduFob.find()

        const schema = [

            {
                type: 'group',
                path: 'level',
                label: 'Уровень',
                children: [
                    {
                        type: 'number',
                        path: 'clevel',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: eduLevels.map((item) => ({
                            value: item.id,
                            label: item.name_ak
                        }))
                    },
                ]
            },
            {
                type: 'group',
                path: 'fob',
                label: 'Форма',
                children: [
                    {
                        type: 'number',
                        path: 'cfob',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: eduFobs.map((item) => ({
                            value: item.id,
                            label: item.name
                        }))
                    },
                ]
            },
            {
                type: 'group',
                path: 'direction',
                label: 'Направление',
                children: [
                    {
                        type: 'number',
                        path: 'cdirection',
                        control: 'number',
                        op: 'eq',
                        label: 'ID',
                    },
                    {
                        type: 'string',
                        path: 'directionOkso',
                        label: 'ОКСО',
                    },
                ]
            },

            {
                type: 'group',
                path: 'campaign',
                label: 'Кампания',
                children: [
                    {
                        type: 'number',
                        path: 'ccampaign',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: eduCampaigns.map((item) => ({
                            value: item.id,
                            label: item.name
                        }))
                    },
                ]
            }
        ]

        return schema
    }

    async syncWithAdmissions(admissionIds): Promise<any> {

        const volumes = {}

        let admissions

        if (admissionIds) {
            admissions = await this.admissionService.find({id: admissionIds})
        } else {
            admissions = await this.admissionService.find({
                clevel: {$in: [4]},
                cfac: {$in: [26,24]}
               // ccampaign: 49
            })
        }

        for (let i = 0; i < admissions.length; i++) {

            const admission = admissions[i]

            const dir = await this.directionService.findOneBy('id', admission.cdirection)

            const cdirection = admission.cdirection


            if (!volumes[cdirection]) {

                volumes[cdirection] = {
                    yr: admission.yr,
                    name: dir ? dir.name : admission.direct_name,
                    ccampaign: admission.ccampaign,
                    cdirection: admission.cdirection,
                    clevel: admission.clevel,

                    budgetO: 0,
                    budgetOZ: 0,
                    budgetZ: 0,

                    quotaO: 0,
                    quotaOZ: 0,
                    quotaZ: 0,

                    otdelO: 0,
                    otdelOZ: 0,
                    otdelZ: 0,

                    targetO: 0,
                    targetOZ: 0,
                    targetZ: 0,

                    paidO: 0,
                    paidOZ: 0,
                    paidZ: 0,
                }
            }


            const vol = volumes[cdirection]

            const compets = await this.competitionService.query().where({
                cadmission: admission.id
            }).execMany()

            const placesBudget = compets.filter(item => item.isBudgetCommon).reduce((map, compet) => {
                map += compet.admissionNumber
                return map
            }, 0)

            const placesQuota = compets.filter(item => [2].indexOf(item.csource)>-1).reduce((map, compet) => {
                map += compet.admissionNumber
                return map
            }, 0)

            const placesOtdel = compets.filter(item => [5].indexOf(item.csource)>-1).reduce((map, compet) => {
                map += compet.admissionNumber
                return map
            }, 0)

            const placesTarget = compets.filter(item => [4].indexOf(item.csource)>-1).reduce((map, compet) => {
                map += compet.admissionNumber
                return map
            }, 0)

            const placesPaid = compets.filter(item => [3].indexOf(item.csource)>-1).reduce((map, compet) => {
                map += compet.admissionNumber
                return map
            }, 0)


            switch (admission.cfob) {
                case 1:
                    vol.budgetO += placesBudget
                    vol.quotaO += placesQuota
                    vol.otdelO += placesOtdel
                    vol.targetO += placesTarget
                    vol.paidO += placesPaid
                    break;
                case 2:
                    vol.budgetZ += placesBudget
                    vol.quotaZ += placesQuota
                    vol.otdelZ += placesOtdel
                    vol.targetZ += placesTarget
                    vol.paidZ += placesPaid
                    break;
                case 3:
                    vol.budgetOZ += placesBudget
                    vol.quotaOZ += placesQuota
                    vol.otdelOZ += placesOtdel
                    vol.targetOZ += placesTarget
                    vol.paidOZ += placesPaid
                    break;
            }
        }

        const volumeIds = []

        for (let [directionNid, volume] of Object.entries(volumes)) {

            let volumeDoc = await this.coreService.findOne({cdirection: directionNid})

            if (!volumeDoc) {
                volumeDoc = this.coreService.createModel({})
            }

            Object.assign(volumeDoc, volume)

            await volumeDoc.savePromise()

            volumeIds.push(volumeDoc.id)
        }

    }

    async getEntitySubdocsTree(entity) {
        return entity.getSubdocsTree()
    }

    async entityAction(action, entity: Model, params = {}) {
        this.entityService.entityAddContext(entity)
        return this['entityAction_' + action](entity)
    }

    async entityAction_fill(entity: Model, params = {}) {
        return entity.actionFill()
    }

    async entityAction_delete(entity: Model, params = {}) {
        return this.coreService.model.deleteOne({_id: entity._id})
    }
}
