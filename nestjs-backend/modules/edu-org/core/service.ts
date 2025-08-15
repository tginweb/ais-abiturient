import {Injectable} from '@nestjs/common'

import {EntityService} from "~modules/entity/entity.service"
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service"
import {EduCompetitionService} from "~modules/edu-org/modules/competition/core/service"
import {EduFobService} from "~modules/edu-org/modules/fob/core/service"
import {EduSourceService} from "~modules/edu-org/modules/source/core/service"
import {EduInstituteService} from "~modules/edu-org/modules/institute/core/service"
import {EduSubjectService} from "~modules/edu-org/modules/subject/core/service"

@Injectable()
export class EduCoreService {

    constructor(
        public readonly entityService: EntityService,
        public readonly admissionService: EduAdmissionService,
        public readonly competitionService: EduCompetitionService,
        public readonly fobService: EduFobService,
        public readonly sourceService: EduSourceService,
        public readonly instituteService: EduInstituteService,
        public readonly subjectService: EduSubjectService,
    ) {
    }

    getContext() {
        return {
            entityService: this.entityService,
        }
    }
}

