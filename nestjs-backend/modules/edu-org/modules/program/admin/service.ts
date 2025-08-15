import {Injectable} from '@nestjs/common'
import {EduAisService} from "~modules/edu-ais/edu-ais.service"
import {EduAdmissionService} from "../../admission/core/service"
import {EduDirectionService} from "../../direction/core/service"
import {EduProgramService as ModelCoreService} from "./../core/service"
import {EduProgramModel as Model} from '../core/model';
import {EntityService} from "~modules/entity/entity.service";
import {EduAdminService} from "~modules/edu-org/admin/service";


@Injectable()
export class EduProgramAdminService {

    constructor(
        private readonly coreService: ModelCoreService,
        private readonly aisService: EduAisService,
        private readonly admissionService: EduAdmissionService,
        private readonly directionService: EduDirectionService,
        private readonly entityService: EntityService,
        private readonly eduAdminService: EduAdminService,
    ) {
        this.entityService.entityTypeAddContext('edu_program', this.eduAdminService.getContext())
    }

    async syncWithAdmissions(admissionIds): Promise<any> {

        const admissions = await this.admissionService.find({id: admissionIds})

        for (let i = 0; i < admissions.length; i++) {

            const admission = admissions[i]

            let programDoc = await this.coreService.findOne({'cadmission': admission.id})

            if (!programDoc) {
                programDoc = this.coreService.createModel({
                    cadmission: admission.id
                })
            }

            programDoc.cdirection = admission.cdirection
            programDoc.cfob = admission.cfob
            programDoc.name = [admission.direct_name, admission.fob['name']].join(', ')
            programDoc.yr = admission.yr

            await programDoc.savePromise()
        }

    }

    async getFiltersTree(): Promise<any> {

        const schema = [
            {
                type: 'group',
                label: 'Объект',
                path: 'admission',
                children: [
                    {
                        type: 'number',
                        path: 'id',
                        label: 'ID',
                        op: 'eq'
                    },
                    {
                        type: 'string',
                        path: 'uid',
                        label: 'UID',
                        op: 'like'
                    },
                ]
            },
        ]

        return schema
    }

    async entityAction(action, entity: Model, params = {}) {
        this.entityService.entityAddContext(entity)
        return this['entityAction_' + action](entity)
    }

    async entityAction_delete(entity: Model, params = {}) {
        return this.coreService.model.deleteOne({_id: entity._id})
    }
}
