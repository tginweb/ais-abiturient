import {EduSubjectAdminService, EduSubjectAdminResolvers} from './index';

export function boot(module) {

    module.exports.push(
        EduSubjectAdminService
    )

    module.providers.push(
        EduSubjectAdminService,
        EduSubjectAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin.dictionaries',
        label: 'Предметы',
        url: '/admin/edu/subject/list',
        accessGroups: ['manager'],
        children: [

        ]
    })
}
