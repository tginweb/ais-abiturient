import {EduAdmissionAdminResolvers, EduAdmissionAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduAdmissionAdminService
    )

    module.providers.push(
        EduAdmissionAdminService,
        EduAdmissionAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin',
        label: 'Наборы',
        url: '/admin/edu/admission/list',
        accessGroups: ['manager'],
    })
}
