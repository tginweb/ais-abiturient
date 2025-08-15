import {Injectable} from '@nestjs/common';

import {EduAdmissionService} from "./modules/admission/core/service";
import {EduLevelService} from "./modules/level/core/service";

@Injectable()
export class EduOrgService {

    constructor(
        private readonly admissionService: EduAdmissionService,
        private readonly levelService: EduLevelService,
    ) {
    }


}
