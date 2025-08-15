import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {EduEpguService} from "~modules/edu-org/modules/epgu-service/core/service";
import {EduEpguDictionaryService} from "~modules/edu-org/modules/epgu-dictionary/core/service";
import {EduEpguDictionaryModel as Model} from "~modules/edu-org/modules/epgu-dictionary/core/model";

@Injectable()
export class EduEpguDictionaryAdminService {

    constructor(
        private readonly coreService: EduEpguDictionaryService,
        @Inject(forwardRef(() => EduEpguService))
        private readonly epguService: EduEpguService,
    ) {
    }

    async getFiltersTree(): Promise<any> {

        const dictTypes = this.coreService.getDictionaryTypesByCode()

        const schema = [
            {
                type: 'boolean',
                label: 'Актуально',
                path: 'actual',
                op: 'eq',
            },
            {
                type: 'string',
                label: 'ID',
                path: 'id',
                op: 'eq',
            },
            {
                type: 'string',
                label: 'Наименование',
                path: 'name',
                op: 'like',
            },
            {
                type: 'group',
                label: 'Словарь',
                path: 'taxonomyGroup',
                children: [
                    {
                        type: 'strgin',
                        path: 'taxonomy',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: Object.keys(dictTypes).map(type => {
                            return {
                                label: dictTypes[type].label + '(' + type + ')',
                                value: type,
                            }
                        })
                    },
                ]
            },
        ]

        return schema
    }

    async syncWithEpgu() {

        for (let [taxCode, tax] of Object.entries(this.coreService.getDictionaryTypesByCode())) {

            const res = await this.epguService.makeRequest('cls/get', {Cls: tax.cls}, 'xml', true)

            if (!res) {
                continue
            }

            if (res.error) {
                throw new Error(res.error)
            }

            console.log(res)

            if (res.PackageData[tax.cls]) {

                const elements = res.PackageData[tax.cls]

                if (elements && elements.length) {

                    for (let i = 0; i < elements.length; i++) {
                        const element = elements[i]
                        await this.syncModelWithEpguData(taxCode, element)
                    }
                }
            } else {
                console.log('Not found tag in result - ' + taxCode)
            }
        }
    }

    async syncModelWithEpguData(taxCode, data) {

        const localDoc = await this.coreService.findOne({
            id: data.Id,
            taxonomy: taxCode
        })

        let model

        if (!localDoc) {
            model = this.coreService.createModel({})
            model.id = data.Id
            model.taxonomy = taxCode
        } else {
            model = localDoc
        }

        model.name = data.Name
        model.actual = data.Actual
        model.fields = {}

        for (let [fieldName, fieldValue] of Object.entries(data)) {

            if (['ID', 'Actual', 'Name'].indexOf(fieldName) === -1) {
                model.fields[fieldName] = fieldValue
            }
        }

        model.save()
    }

    async entityAction(action, entity: Model, args) {
        //this.entityService.entityAddContext(entity)
        return this['entityAction_' + action](entity, args)
    }

}
