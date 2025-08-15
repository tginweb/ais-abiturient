import {EduSSEntrantAdminResolvers, EduSSEntrantAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduSSEntrantAdminService
    )

    module.providers.push(
        EduSSEntrantAdminService,
        EduSSEntrantAdminResolvers
    )
}

export function menuItems(items) {

    items.push({
        parentCode: 'edu-epgu',
        code: 'edu-epgu.ssentrant',
        label: 'Выгрузка Абитуриенты',
        url: '/admin/edu-epgu/ss-entrant/list',
        accessGroups: ['manager'],
    })

    items.push({
        parentCode: 'edu-org.operator',
        code: 'edu-epgu.ssentrant.operator',
        label: 'Абитуриенты ЕПГУ',
        url: '/admin/edu-epgu/ss-entrant/operator/list',
        accessGroups: ['manager', 'operator'],
    })

    items.push({
        parentCode: 'edu-org.fac',
        code: 'edu-epgu.ssentrant.fac',
        label: 'Абитуриенты ЕПГУ',
        url: '/admin/edu-epgu/ss-entrant/fac/list',
        accessGroups: ['fac'],
    })
}
