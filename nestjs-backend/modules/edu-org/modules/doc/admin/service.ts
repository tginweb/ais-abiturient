import {Injectable} from '@nestjs/common';
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduDocService as ModelCoreService} from "./../core/service";
import {AbitWorkplaceList} from "~modules/edu-org/enum/source-workplace";
import {EduDocModel} from "~modules/edu-org/modules/doc/core/model";
import {EduEpguService} from "~modules/edu-org/modules/epgu-service/core/service";
const mime = require('mime');

@Injectable()
export class EduDocAdminService {

    constructor(
        private readonly coreService: ModelCoreService,
        private readonly aisService: EduAisService,
        private readonly epguService: EduEpguService,
    ) {
    }

    async getFiltersTree(): Promise<any> {

        const schema = [
            {
                label: 'Источник',
                type: 'string',
                path: 'createSource',
                control: 'options',
                multitple: true,
                op: 'in',
                options: AbitWorkplaceList.map((item) => ({
                    label: item.title,
                    value: item.id,
                }))
            },
            {
                label: 'Есть ЕПГУ FUI',
                path: 'epguFuiExists',
                control: 'dropdown',
                op: 'eq',
                options: [
                    {label: 'да', value: true},
                    {label: 'нет', value:false},
                ]
            },
        ]

        return schema
    }

    async action_epguFileGet(doc: EduDocModel) {

        if (doc.epgu.fui) {
            const file: any = await this.epguService.fileGet(doc.epgu.fui)
            if (file && file.content) {
                await this.coreService.createFileFromEpgu(doc, file)
            }
        }
    }
}
