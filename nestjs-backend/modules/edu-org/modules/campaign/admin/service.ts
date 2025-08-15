import {Injectable} from '@nestjs/common';
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduCampaignService as ModelCoreService} from "./../core/service";

@Injectable()
export class EduCampaignAdminService {

    constructor(
        private readonly coreService: ModelCoreService,
        private readonly aisService: EduAisService,
    ) {
    }

    async syncWithAis(): Promise<any> {

        const rep = this.aisService.getRepository()

        const aisRows = await rep.selectAllFrom('cl$abitconst')

        for (let i = 0; i < aisRows.length; i++) {
            const aisRow = aisRows[i]

            if (!aisRow.id) continue;

            const localRow = await this.coreService.findOneBy('id', aisRow.id)
            let row

            if (!localRow) {
                row = this.coreService.createModel({})
                row.id = aisRow.id
            } else {
                row = localRow
            }

            row.name = aisRow.name
            row.save()
        }
    }
}
