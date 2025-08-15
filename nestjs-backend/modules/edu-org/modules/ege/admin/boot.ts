import {EduEgeAdminResolvers, EduEgeAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduEgeAdminService
    )

    module.providers.push(
        EduEgeAdminService,
        EduEgeAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin',
        label: 'ЕГЭ',
        url: '/admin/edu/ege/list',
        accessGroups: ['manager'],
        children: [

        ]
    })
}
