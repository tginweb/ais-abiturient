import {AbitOrderAdminController, AbitOrderAdminService, AbitOrderAdminAisController} from './index';

import * as Resolvers from './resolvers';

export function boot(module, context) {

    module.exports.push(
        AbitOrderAdminService,
    )

    module.controllers.push(
        AbitOrderAdminController,
        AbitOrderAdminAisController
    )

    module.providers = [
        ...module.providers,
        AbitOrderAdminService,
        ...Object.values(Resolvers)
    ]

}

export function menuItems(items) {

    items.push({
        parentCode: 'edu-org.admin',
        label: 'Выгрузка для Moodle',
        url: '/admin/edu/moodle/list',
        accessGroups: ['manager'],
    })

    items.push({
        parentCode: 'edu-org.admin',
        label: 'Абитуриенты',
        url: '/admin/edu/order/admin/list',
        accessGroups: ['manager'],
    })

    items.push({
        parentCode: 'edu-org.admin',
        label: 'Абитуриенты - сверка',
        url: '/admin/edu/order/admin/sverka',
        accessGroups: ['manager'],
    })


    items.push({
        parentCode: 'edu-org.operator',
        label: 'В работе',
        url: '/admin/edu/order/operator/active',
    })

    items.push({
        parentCode: 'edu-org.operator',
        label: 'Очередь',
        url: '/admin/edu/order/operator/queue',
    })

    items.push({
        parentCode: 'edu-org.operator',
        label: 'Архив обработанных',
        url: '/admin/edu/order/operator/archive',
    })

    items.push({
        parentCode: 'edu-org.operator',
        label: 'Все абитуриенты',
        url: '/admin/edu/order/operator/all',
    })




    items.push({
        code: 'edu-org.fac.orders',
        parentCode: 'edu-org.fac',
        label: 'Абитуриенты',
        url: '/admin/edu/order/fac/taken',
    })

    items.push({
        parentCode: 'edu-org.fac.orders',
        label: 'Переданные на факультет',
        url: '/admin/edu/order/fac/taken',
    })

    items.push({
        parentCode: 'edu-org.fac.orders',
        label: 'Все по приоритету №1',
        url: '/admin/edu/order/fac/primary',
    })

    items.push({
        parentCode: 'edu-org.fac.orders',
        label: 'Россияне',
        url: '/admin/edu/order/fac/russian',
    })

    items.push({
        parentCode: 'edu-org.fac.orders',
        label: 'Иностранцы',
        url: '/admin/edu/order/fac/foreign',
    })

    items.push({
        parentCode: 'edu-org.fac.orders',
        label: 'Все абитуриенты',
        url: '/admin/edu/order/fac/all',
    })

    items.push({
        parentCode: 'edu-org.fac.orders',
        label: 'Все кандидаты',
        url: '/admin/edu/order/fac/candidate',
    })


    items.push({
        code: 'edu-org.fac.zach',
        parentCode: 'edu-org.fac',
        label: 'Зачисление',
        url: '/admin/edu/order/fac/zach',
    })
}
