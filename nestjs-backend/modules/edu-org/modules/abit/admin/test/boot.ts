import {AbitTestAdminResolvers, AbitTestAdminService} from './index';

export function boot(module, context) {

    module.exports.push(
        AbitTestAdminService,
    )

    module.controllers.push(

    )

    module.providers.push(
        AbitTestAdminService,
        AbitTestAdminResolvers
    )

}


export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin',
        label: 'Вступительные испытания',
        url: '/admin/edu/test/admin/list',
        accessGroups: ['manager'],
    })
}
