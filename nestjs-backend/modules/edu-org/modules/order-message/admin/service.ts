import {Injectable} from '@nestjs/common';
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduOrderMessageService as ModelCoreService} from "./../core/service";

@Injectable()
export class EduOrderMessageAdminService {

    constructor(
        private readonly coreService: ModelCoreService,
        private readonly aisService: EduAisService,
    ) {
    }


}
