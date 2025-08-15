import {EduVolumeAdminResolvers, EduVolumeAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduVolumeAdminService
    )

    module.providers.push(
        EduVolumeAdminService,
        EduVolumeAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin',
        label: 'Объемы приема',
        url: '/admin/edu/volume/list',
        accessGroups: ['manager'],
    })
}
