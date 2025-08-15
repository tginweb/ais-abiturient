import {EduSSAppAdminResolvers, EduSSAppAdminService, EduSSAppAdminController} from './index';

export function boot(module) {

    module.exports.push(
        EduSSAppAdminService
    )

    module.providers.push(
        EduSSAppAdminService,
        EduSSAppAdminResolvers
    )

    module.controllers.push(
        EduSSAppAdminController
    )
}

export function menuItems(items) {

    items.push({
        parentCode: 'edu-epgu',
        label: 'Заявления',
        url: '/admin/edu-epgu/ss-app/list',
        accessGroups: ['manager'],
    })
}
