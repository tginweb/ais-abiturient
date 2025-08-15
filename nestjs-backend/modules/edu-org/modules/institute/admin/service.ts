import {Injectable} from '@nestjs/common';
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduInstituteService as ModelCoreService} from "./../core/service";

@Injectable()
export class EduInstituteAdminService {

    constructor(
        private readonly coreService: ModelCoreService,
        private readonly aisService: EduAisService,
    ) {

    }

    async syncWithAis(): Promise<any> {

        const rep = this.aisService.getRepository()

        const aisRows = await rep.selectAllFrom('cl$admkind')

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
            row.name_vi_many = aisRow.name_vi_many
            row.name_ak = aisRow.name_ak
            row.fisid = aisRow.fisid
            row.save()
        }
    }
}
