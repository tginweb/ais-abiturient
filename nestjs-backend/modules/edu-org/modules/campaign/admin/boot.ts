import {EduCampaignAdminResolvers, EduCampaignAdminService,} from './index';

export function boot(module) {

    module.exports.push(
        EduCampaignAdminService
    )

    module.providers.push(
        EduCampaignAdminService,
        EduCampaignAdminResolvers
    )
}

export function menuItems(items) {
    items.push({
        parentCode: 'edu-org.admin',
        label: 'Кампании',
        url: '/admin/edu/campaign/list',
        accessGroups: ['manager'],
    })
}
