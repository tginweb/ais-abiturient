import {EduFobAdminResolvers, EduFobAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduFobAdminService
    )

    module.providers.push(
        EduFobAdminService,
        EduFobAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin.dictionaries',
        label: 'Формы образования',
        url: '/admin/edu/fob/list',
        accessGroups: ['manager'],
        children: [

        ]
    })
}
