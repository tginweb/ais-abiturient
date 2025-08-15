import {EduOrderMessageAdminResolvers, EduOrderMessageAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduOrderMessageAdminService
    )

    module.providers.push(
        EduOrderMessageAdminService,
        EduOrderMessageAdminResolvers
    )
}

export function menuItems(items) {

}
