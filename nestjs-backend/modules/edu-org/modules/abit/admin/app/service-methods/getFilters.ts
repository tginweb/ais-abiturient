
import {AbitAppAdminService} from "../service";
import {AbitWorkplaceList} from "~modules/edu-org/enum/source-workplace";
import {AppStatusEnum, appStatusList} from "~modules/edu-org/modules/abit/core/app/enum";

export default async function (this: AbitAppAdminService) {

    const eduSources = await this.sourceService.query().execMany()

    const schema = [
        {
            label: 'Дубль при импорте',
            type: 'boolean',
            path: 'isDoubleImport',
            op: 'eq'
        },
        {
            label: 'ЕПГУ exists',
            type: 'boolean',
            path: 'epguExists',
            op: 'eq'
        },
        {
            label: 'ЕПГУ APP GUID',
            type: 'string',
            path: 'epguAppGuid',
            op: 'eq'
        },
        {
            type: 'number',
            path: 'nid',
            label: 'ID заявления',
            op: 'eq'
        },
        {
            type: 'number',
            path: 'orderNid',
            label: 'ID абитуриента',
            op: 'eq'
        },
        {
            label: 'Статус',
            type: 'number',
            path: 'statusId',
            control: 'options',
            multitple: true,
            op: 'in',
            options: appStatusList.map((item) => ({
                label: item.title,
                value: item.id,
            }))
        },
        {
            label: 'Основа',
            type: 'number',
            path: 'csource',
            control: 'options',
            multitple: true,
            op: 'in',
            options: eduSources.map((item) => ({
                label: item.name,
                value: item.id,
            }))
        },
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


    ]


    return schema
}
