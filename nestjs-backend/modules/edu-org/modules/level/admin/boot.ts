import {EduLevelAdminResolvers, EduLevelAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduLevelAdminService
    )

    module.providers.push(
        EduLevelAdminService,
        EduLevelAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin.dictionaries',
        label: 'Уровни',
        url: '/admin/edu/level/list',
        accessGroups: ['manager'],
        children: [

        ]
    })
}
