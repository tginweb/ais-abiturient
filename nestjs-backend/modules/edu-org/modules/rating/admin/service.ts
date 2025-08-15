import {Injectable} from '@nestjs/common';
import {EduRatingService as ModelCoreService} from "../core/service"
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduLevelService} from "~modules/edu-org/modules/level/core/service";
import {EduFobService} from "~modules/edu-org/modules/fob/core/service";
import {EduCampaignService} from "~modules/edu-org/modules/campaign/core/service";
import {EduAdminService} from "~modules/edu-org/admin/service";
import {EntityService} from "~modules/entity/entity.service";
import {EduDirectionService} from "~modules/edu-org/modules/direction/core/service";
import {EduSourceService} from "~modules/edu-org/modules/source/core/service";
import {EduInstituteService} from "~modules/edu-org/modules/institute/core/service";
import {EduRatingAdminQuery as ModelQuery} from "./query";
import {EduRatingModel} from "~modules/edu-org/modules/rating/core";

const fs = require('fs')


@Injectable()
export class EduRatingAdminService {

    constructor(
        private readonly modelCoreService: ModelCoreService,
        private readonly aisService: EduAisService,
        private readonly serviceEduLevel: EduLevelService,
        private readonly serviceEduFob: EduFobService,
        private readonly serviceEduCampaign: EduCampaignService,
        private readonly entityService: EntityService,
        private readonly eduAdminService: EduAdminService,
        private readonly eduDirectionService: EduDirectionService,
        private readonly eduSourceService: EduSourceService,
        private readonly eduInstituteService: EduInstituteService,
    ) {
        this.entityService.entityTypeAddContext('edu_admission', this.eduAdminService.getContext())
    }

    async getFiltersTree(): Promise<any> {

        const eduFobs = await this.serviceEduFob.find()
        const eduDirections = await this.eduDirectionService.find({deprecated: 'f'})
        const eduSources = await this.eduSourceService.find()
        const eduInstitutes = await this.eduInstituteService.find()

        const schema = [
            {
                type: 'string',
                path: 'name',
                label: 'Направление',
                op: 'like'
            },
            {
                label: 'Институт',
                type: 'number',
                path: 'cfac',
                control: 'select',
                op: 'in',
                options: eduInstitutes.map((item) => ({
                    value: item.id,
                    label: item.name
                }))
            },
            {
                label: 'Направление',
                type: 'number',
                path: 'cdirection',
                control: 'select',
                op: 'in',
                options: eduDirections.map((item) => ({
                    value: item.id,
                    label: item.cod + ' ' + item.name
                }))
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
                path: 'source',
                label: 'Основа',
                children: [
                    {
                        type: 'number',
                        path: 'csource',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: eduSources.map((item) => ({
                            value: item.id,
                            label: item.name
                        }))
                    },
                ]
            },
        ]

        return schema
    }

    query() {
        return (new ModelQuery(this.modelCoreService.model.find())).addModelContext(this.modelCoreService.modelContext())
    }

    async entityAction_delete(doc: EduRatingModel) {

        try {
            fs.unlinkSync(doc.dataFilePath)
        } catch (e) {

        }

        await doc.deletePromise()
    }
}
