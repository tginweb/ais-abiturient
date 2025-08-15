import {EduSourceAdminResolvers, EduSourceAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduSourceAdminService
    )

    module.providers.push(
        EduSourceAdminService,
        EduSourceAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin.dictionaries',
        label: 'Источники финансирования',
        url: '/admin/edu/source/list',
        accessGroups: ['manager'],
        children: [

        ]
    })
}
