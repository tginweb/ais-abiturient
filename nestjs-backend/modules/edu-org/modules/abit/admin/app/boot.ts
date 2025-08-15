import { EduAppAdminResolvers, AbitAppAdminService} from './index';

export function boot(module, context) {
    module.exports.push(
        AbitAppAdminService,
    )

    module.providers.push(
        AbitAppAdminService,
        EduAppAdminResolvers,
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin',
        label: 'Заявления',
        url: '/admin/edu/app/admin/list',
        accessGroups: ['manager'],
    })

    items.push({
        code: 'edu-org.fac.apps',
        parentCode: 'edu-org.fac',
        label: 'Заявления',
        url: '/admin/edu/app/fac/member',
    })

    items.push({
        parentCode: 'edu-org.fac.apps',
        label: 'Принятые по факультету',
        url: '/admin/edu/app/fac/member',
    })

    items.push({
        parentCode: 'edu-org.fac.apps',
        label: 'Все по факультету',
        url: '/admin/edu/app/fac/all',
    })
}
