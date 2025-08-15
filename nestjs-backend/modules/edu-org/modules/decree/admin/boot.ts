import {EduDecreeAdminResolvers, EduDecreeAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduDecreeAdminService
    )

    module.providers.push(
        EduDecreeAdminService,
        EduDecreeAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin',
        label: 'Приказы',
        url: '/admin/edu/decree/list',
        accessGroups: ['manager'],
    })
}
