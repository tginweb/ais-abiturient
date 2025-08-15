import {EduDocAdminResolvers, EduDocAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduDocAdminService
    )

    module.providers.push(
        EduDocAdminService,
        EduDocAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin',
        label: 'Документы',
        url: '/admin/edu/doc/list',
        accessGroups: ['manager'],
        children: [

        ]
    })
}
