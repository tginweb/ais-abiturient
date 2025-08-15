import {EduInstituteAdminResolvers, EduInstituteAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduInstituteAdminService
    )

    module.providers.push(
        EduInstituteAdminService,
        EduInstituteAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin.dictionaries',
        label: 'Факультеты',
        url: '/admin/edu/institute/list',
        accessGroups: ['manager'],
        children: [

        ]
    })
}
