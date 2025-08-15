import {EduRatingAdminResolvers, EduRatingAdminService,} from './index';
import {EduRatingAdminController} from "./controller";

export function boot(module) {
    module.controllers.push(
        EduRatingAdminController
    )
    module.exports.push(
        EduRatingAdminService
    )
    module.providers.push(
        EduRatingAdminService,
        EduRatingAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin',
        label: 'Конкурсные списки',
        url: '/admin/edu/rating/list',
        accessGroups: ['manager'],
    })
}
