import {EduSheetAdminResolvers, EduSheetAdminService,} from './index';
import {EduSheetAdminController} from "./controller";

export function boot(module) {
    module.controllers.push(
        EduSheetAdminController
    )
    module.exports.push(
        EduSheetAdminService
    )
    module.providers.push(
        EduSheetAdminService,
        EduSheetAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin',
        label: 'Ведомости',
        url: '/admin/edu/sheet/list',
        accessGroups: ['manager'],
    })
}
