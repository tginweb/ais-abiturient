import {Injectable} from '@nestjs/common';
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduDirectionService as ModelCoreService} from "./../core/service";

@Injectable()
export class EduDirectionAdminService {

    constructor(
        private readonly coreService: ModelCoreService,
        private readonly aisService: EduAisService,
    ) {
    }

    async syncWithAis(): Promise<any> {


        const rep = this.aisService.getRepository()

        const aisRows = await rep.selectAllFrom('cl$direction')

        for (let i = 0; i < aisRows.length; i++) {
            const aisRow = aisRows[i]

            if (!aisRow.id)
                continue

            const localRow = await this.coreService.findOneBy('id', aisRow.id)
            let row

            if (!localRow) {
                row = this.coreService.createModel({})
                row.id = aisRow.id
            } else {
                row = localRow
            }

            row.cod = aisRow.cod
            row.name = aisRow.name
            row.cperson = aisRow.cperson
            row.cugspec = aisRow.cugspec
            row.dubl = aisRow.dubl
            row.cpnr = aisRow.cpnr
            row.abbr = aisRow.abbr
            row.cspeczvanie = aisRow.cspeczvanie
            row.cspecprice = aisRow.cspecprice
            row.code = aisRow.code
            row.deprecated = aisRow.deprecated
            row.name_en = aisRow.name_en

            row.save()
        }
    }
}
