import {Injectable} from '@nestjs/common';
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduDecreeService as ModelCoreService} from "./../core/service";
import {AisDecree} from "~modules/edu-org/modules/ais/core/types";

@Injectable()
export class EduDecreeAdminService {

    constructor(
        private readonly coreService: ModelCoreService,
        private readonly aisService: EduAisService,
    ) {
    }

    async syncWithAisData(aisDecrees: AisDecree[]): Promise<any> {
       for (let aisDecree of aisDecrees) {
           const decree = await this.coreService.ensureAisDecree(aisDecree)
       }
    }
}
