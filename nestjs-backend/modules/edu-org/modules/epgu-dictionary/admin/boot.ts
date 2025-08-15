import {EduEpguDictionaryAdminResolvers, EduEpguDictionaryAdminService} from './index';

export function boot(module) {

    module.exports.push(
        EduEpguDictionaryAdminService
    )

    module.providers.push(
        EduEpguDictionaryAdminService,
        EduEpguDictionaryAdminResolvers
    )
}


export function menuItems(items, ctx) {

    items.push({
        parentCode: 'edu-epgu',
        code: 'edu-epgu.dictionary',
        label: 'Справочники',
        url: '/admin/edu-epgu/dictionary/term/list',
        accessGroups: ['manager'],
    })

}
