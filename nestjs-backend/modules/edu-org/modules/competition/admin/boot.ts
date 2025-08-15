import {EduCompetitionAdminResolvers, EduCompetitionAdminService,} from './index';
import {EduCompetitionAdminController} from "./controller";

export function boot(module) {
    module.controllers.push(
        EduCompetitionAdminController
    )
    module.exports.push(
        EduCompetitionAdminService
    )

    module.providers.push(
        EduCompetitionAdminService,
        EduCompetitionAdminResolvers
    )
}

export function menuItems(items) {

    items.push({
        parentCode: 'edu-org.admin',
        label: 'Зачисление',
        url: '/admin/edu/competition/zachisl',
        accessGroups: ['manager'],
    })


    items.push({
        parentCode: 'edu-org.admin',
        label: 'Конкурсы',
        url: '/admin/edu/competition/list',
        accessGroups: ['manager'],
    })

    items.push({
        code: 'edu-org.fac.competition',
        parentCode: 'edu-org.fac',
        label: 'Конкурсы',
        url: '/admin/edu/competition/fac/own',
    })

    items.push({
        parentCode: 'edu-org.fac.competition',
        label: 'По факультету',
        url: '/admin/edu/competition/fac/own',
    })

    items.push({
        parentCode: 'edu-org.fac.competition',
        label: 'Все конкурсы',
        url: '/admin/edu/competition/fac/all',
    })

}
