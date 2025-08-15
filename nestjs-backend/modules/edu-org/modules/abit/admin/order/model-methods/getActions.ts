import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";

export default function getActions(user) {

    const self: AbitOrderModel = this

    const result = []

    const perms = self.getAdminPerms(user)

    result.push({
        name: 'view',
        label: 'Просмотр',
        icon: 'view',
        rowRoot: true,
        listEvent: 'open',
        type: 'vrouter',
        path: '/admin/edu/order/' + self.id + '/view',
        access: true
    })

    result.push({
        label: 'Взять в работу оператора',
        icon: 'fasBriefcase',
        type: 'vrouter',
        path: '/admin/edu/order/' + self.id + '/take',
        roles: ['operator', 'fac'],
        access: self.canTakeByOperator
    })

    result.push({
        label: 'Сменить статус абитуриента',
        icon: 'fasCompass',
        type: 'vrouter',
        path: '/admin/edu/order/' + self.id + '/set-status',
        roles: ['operator', 'fac', 'manager'],
        access: perms.manage
    })

    result.push({
        label: 'Подлинник документа',
        icon: 'farCheckCircle',
        type: 'vrouter',
        path: '/admin/edu/order/' + self.id + '/set-edu-original',
        roles: [],
        access: perms.manage
    })

    result.push({
        label: 'Передать на факультет заявления №1',
        type: 'vrouter',
        path: '/admin/edu/order/' + self.id + '/set-fac-first',
        icon: 'farShareSquare',
        argsIdMultiple: false,
        roles: ['fac', 'manager', 'admin'],
        access: self.cinstitute && self.firstApp.cfac && (self.cinstitute !== self.firstApp.cfac)
    })

    result.push({
        label: 'Передать на факультет',
        icon: 'farShareSquare',
        type: 'vrouter',
        path: '/admin/edu/orders/set-fac',
        argsIdMultiple: true,
        roles: ['fac', 'manager'],
        access: true
    })

    result.push({
        label: 'Перенести в приказ',
        icon: 'farShareSquare',
        type: 'vrouter',
        path: '/admin/edu/orders/set-decree',
        argsIdMultiple: true,
        roles: ['fac', 'manager'],
        access: true
    })

    result.push({
        id: 'ege',
        label: 'ЕГЭ',
        roles: ['admin'],
        group: true,

        children: [
            {
                label: 'Скачать пакет ФИС',
                type: 'dispatch',
                path: 'edu_ege/openPacketDialog',
                argsIdMultiple: true,
            },
            {
                label: 'Распечатать свидетельство',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'prezach_to_zach'
                }
            },
        ],
    })

    result.push({
        id: 'admin',
        label: 'Администрировать',
        roles: ['admin'],
        group: true,

        children: [
            {
                label: 'Перенести в приказ',
                icon: 'farShareSquare',
                type: 'vrouter',
                path: '/admin/edu/orders/set-decree',
                argsIdMultiple: true,
                roles: ['fac', 'manager'],
                access: true
            },
            {
                label: 'Рассчитать приказ',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'calc_decree'
                }
            },
            {
                label: 'В приказ ДОПНАБОР бюджет',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'to_order_dopnabor_budget'
                }
            },
            {
                label: 'В приказ МАГИСТРАТУРА - бюджет',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'to_order_mag_budget'
                }
            },
            {
                label: 'В приказ ОСОБАЯ квота',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'to_order_osob_quota'
                }
            },
            {
                label: 'В приказ ОТДЕЛЬНАЯ квота',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'to_order_otdel_quota'
                }
            },
            {
                label: 'В приказ БВИ',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'to_order_bvi'
                }
            },
            {
                label: 'В приказ ОБЩИЙ',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'to_order_obsh'
                }
            },
            {
                label: 'В приказ заочная коммерция',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'to_order_zaoch_commerce'
                }
            },
            {
                label: 'Актуализировать зачисление',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'zach_actualize'
                }
            },
            {
                label: 'Перенести допнабор',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'move_dopnab'
                }
            },
            {
                label: 'Предзачисленным статус заявления - в Приказе',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'prezach_to_zach'
                }
            },
            {
                label: 'Заявления в Приказе - установить предзачисленными',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'app_inorder_to_prezach'
                }
            },
            {
                label: 'Удалить дело',
                confirm: true,
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'delete'
                }
            },
            {
                label: 'normalize_priority',
                confirm: true,
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'normalize_priority'
                }
            },
            {
                label: 'Сменить юзера',
                type: 'vrouter',
                path: '/admin/edu/order/' + self.id + '/change-user',
            },
            {
                label: 'AppsErrorsCalc',
                confirm: true,
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'appsErrorsCalc'
                }
            },
            {
                label: 'Was accepted',
                confirm: true,
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'wasAccepted'
                }
            },
            {
                label: 'Удалить факутльтет',
                confirm: true,
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'delete_fac'
                }
            },
            {
                label: 'Установать факутльтет по №1',
                confirm: true,
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'set_fac_by_first'
                }
            },

            {
                label: 'Custom',
                confirm: true,
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'custom'
                }
            },
            {
                label: 'Заполнить внутренние документы',
                confirm: true,
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'ensure_docs_internal'
                }
            },
            {
                label: 'Сменить оператора',
                type: 'vrouter',
                path: '/admin/edu/orders/set-operator',
                argsIdMultiple: true,
            },
            {
                label: 'Сменить факультет',
                type: 'vrouter',
                path: '/admin/edu/orders/set-fac',
                argsIdMultiple: true,
            },
            {
                label: 'Обновить заявление №1',
                confirm: true,
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'first_app_update'
                }
            },
        ],
    })

    result.push({
        id: 'port',
        label: 'Портинг',
        roles: ['admin'],
        group: true,
        children: [

            {
                label: 'Перенести ВСË',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'port_all'
                }
            },
            {
                label: 'Перенести PART',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'port_part'
                }
            },
            {
                label: 'Перенести заявления',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'port_apps'
                }
            },
            {
                label: 'Перенести вступительные испытания',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'port_tests'
                }
            },
            {
                label: 'Перенести ДУЛ',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                confirm: true,
                args: {
                    mutation: 'action',
                    action: 'port_dul'
                }
            },
            {
                label: 'Перенести Образование',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                confirm: true,
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'port_edu'
                }
            },
            {
                label: 'Перенести Пакет документов',
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                confirm: true,
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'port_docs_packet'
                }
            },
        ],
    })

    result.push({
        id: 'epgu',
        label: 'ЕПГУ',
        roles: ['admin'],
        group: true,
        children: [
            {
                label: 'Отправить в приказ на зачисление',
                confirm: true,
                group: true,
                type: 'dispatch',
                path: 'edu_epgu_message/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'createFromEntities',
                    messageType: 'CompetitiveGroupStatusToInorder',
                    entityType: 'edu_order',
                    split: 999
                },
            },

            {
                label: 'Отправить подлинник',
                confirm: true,
                group: true,
                type: 'dispatch',
                path: 'edu_epgu_message/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'createFromEntities',
                    messageType: 'OriginalEducationDocumentListAddMultiple',
                    entityType: 'edu_order',
                    split: 199
                },
            },

            {
                group: true,
                label: 'Entrant',
                children: [
                    {
                        group: true,
                        label: 'Get',
                        confirm: true,
                        type: 'dispatch',
                        path: 'edu_epgu_message/apiMutate',
                        argsIdMultiple: true,
                        args: {
                            mutation: 'createFromEntity',
                            messageType: 'ServiceEntrantGet',
                            entityType: 'edu_order',
                        },
                    },
                    {
                        group: true,
                        label: 'Add',
                        confirm: true,
                        type: 'dispatch',
                        path: 'edu_epgu_message/apiMutate',
                        argsIdMultiple: true,
                        args: {
                            mutation: 'createFromEntity',
                            messageType: 'ServiceEntrantAdd',
                            entityType: 'edu_order',
                        },
                    },
                ],
            },
            {
                group: true,
                label: 'Fetch epgu apps',
                confirm: true,
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'epguAction',
                    action: 'epgu.apps:fetch',
                },
            },
            {
                label: 'ApplicationListAdd',
                confirm: true,
                group: true,
                type: 'dispatch',
                path: 'edu_epgu_message/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'createFromEntity',
                    messageType: 'ApplicationListAdd',
                    entityType: 'edu_order',
                },
            },
            {
                label: 'ApplicationListAddMultiple',
                confirm: true,
                group: true,
                type: 'dispatch',
                path: 'edu_epgu_message/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'createFromEntities',
                    messageType: 'ApplicationListAddMultiple',
                    entityType: 'edu_order',
                    split: 20
                },
            },
        ],
    })

    result.push({
        id: 'fis',
        label: 'ФИС',
        roles: ['admin'],
        group: true,
        children: [
            {
                label: 'Отправить',
                confirm: true,
                group: true,
                type: 'dispatch',
                path: 'edu_fis_message/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'createFromEntities',
                    messageType: 'ApplicationUpdate',
                    entityType: 'edu_order',
                },
            },
            {
                label: 'В приказ',
                confirm: true,
                group: true,
                type: 'dispatch',
                path: 'edu_fis_message/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'createFromEntities',
                    messageType: 'ApplicationToOrder',
                    entityType: 'edu_order',
                },
            },

            {
                label: 'Отметить как выгруженные',
                confirm: true,
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'fist_set_exported'
                }
            },
            {
                label: 'Отметить как НЕ выгруженные',
                confirm: true,
                type: 'dispatch',
                path: 'edu_order/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'fist_unset_exported'
                }
            },
        ],
    })

    return result.filter(item => {
        if (item.roles && item.roles.length && !user.haveRole(item.roles)) return false
        if (typeof item.access === 'boolean') {
            return item.access
        }
        return true
    })
}
