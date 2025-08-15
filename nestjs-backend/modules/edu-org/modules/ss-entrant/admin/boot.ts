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
        label: ' Абитуриенты',
        url: '/admin/edu-epgu/ss-entrant/list',
        accessGroups: ['manager'],
    })


}
