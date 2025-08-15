import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduLevelService} from "~modules/edu-org/modules/level/core/service";
import {EduFobService} from "~modules/edu-org/modules/fob/core/service";
import {EduCampaignService} from "~modules/edu-org/modules/campaign/core/service";
import {EntityService} from "~modules/entity/entity.service";
import {EduAdminService} from "~modules/edu-org/admin/service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {EduInstituteService} from "~modules/edu-org/modules/institute/core/service";
import {EduQuotaTypeService} from "~modules/edu-org/modules/quota-type/core/service";
import {AbitTestService} from "~modules/edu-org/modules/abit/core/test/service";
import {UserService} from "~modules/user/core/user.service";
import {AbitOrderAdminService} from "~modules/edu-org/modules/abit/admin/order/service";
import {AbitTestAdminQuery as ModelAdminQuery} from "./query";
import {EduSubjectService} from "~modules/edu-org/modules/subject/core";
import {abitTestPassingTypeList} from "~modules/edu-org/modules/abit/core/test/enum";

@Injectable()
export class AbitTestAdminService {

    constructor(
        @Inject(forwardRef(() => AbitOrderAdminService))
        private readonly abitOrderAdminService: AbitOrderAdminService,
        private readonly aisService: EduAisService,
        private readonly serviceEduLevel: EduLevelService,
        private readonly serviceEduFob: EduFobService,
        private readonly serviceEduCampaign: EduCampaignService,
        private readonly entityService: EntityService,
        private readonly eduAdminService: EduAdminService,
        private readonly eduAdmissionService: EduAdmissionService,
        private readonly eduInstituteService: EduInstituteService,
        private readonly eduQuotaType: EduQuotaTypeService,
        private readonly userService: UserService,
        private readonly coreService: AbitTestService,
        protected readonly subjectService: EduSubjectService,
    ) {
        this.entityService.registerEntityType('edu_app', {
            label: '',
            adminService: this
        })
    }

    modelContext(): any {
        return {
            adminService: this
        }
    }

    query() {
        return (new ModelAdminQuery(this.model.find())).addModelContext({
            ...this.coreService.modelContext(),
            ...this.modelContext(),
        })
    }

    get model() {
        return this.coreService.model
    }

    async getFilters() {

        const subjects = await this.subjectService.find()
        const eduInstitute = await this.eduInstituteService.find()

        const schema = [
            {
                label: 'Предметы',
                path: 'csubject',
                control: 'select',
                multiple: true,
                useChips: true,
                op: 'in',
                options: subjects.map(item => ({
                    label: item.name,
                    value: item.id,
                }))
            },
            {
                label: 'Способ сдачи',
                path: 'passingType',
                control: 'select',
                useChips: true,
                multiple: true,
                op: 'in',
                options: abitTestPassingTypeList.map(item => ({
                    label: item.name,
                    value: item.id,
                }))
            },
            {
                label: 'Есть абитуриент',
                path: 'orderExists',
                control: 'dropdown',
                op: 'eq',
                options: [
                    {label: 'да', value: true},
                    {label: 'нет', value:false},
                ]
            },
            {
                label: 'Есть результат',
                path: 'resultExists',
                control: 'dropdown',
                op: 'eq',
                options: [
                    {label: 'любой', value: 'any'},
                    {label: 'по версии абит.', value: 'abit'},
                    {label: 'проверенный', value: 'real'},
                    {label: 'нет результата', value: 'no'},
                ]
            },
            {
                type: 'group',
                path: 'institute',
                label: 'Факультет ',
                children: [
                    {
                        label: 'Дело на факультете',
                        type: 'string',
                        path: 'cinstitute',
                        control: 'select',
                        useChips: true,
                        multiple: true,
                        op: 'in',
                        options: eduInstitute.filter(item => item.meta.realfac === 't').map((item) => ({
                            value: item.id,
                            label: item.name
                        }))
                    },
                    {
                        label: 'Факультет высшего приоритета',
                        type: 'string',
                        path: 'cinstituteFirstApp',
                        control: 'select',
                        useChips: true,
                        multiple: true,
                        op: 'in',
                        options: eduInstitute.filter(item => item.meta.realfac === 't').map((item) => ({
                            value: item.id,
                            label: item.name
                        }))
                    },
                ]
            },
        ]

        return schema
    }
}
