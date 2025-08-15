import {EduProgramAdminResolvers, EduProgramAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduProgramAdminService
    )

    module.providers.push(
        EduProgramAdminService,
        EduProgramAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin',
        label: 'Программы',
        url: '/admin/edu/program/list',
        accessGroups: ['manager'],
    })
}
