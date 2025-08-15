
export default function getActions(user) {

    const result = []

    result.push({
        name: 'view',
        label: 'Просмотр',
        icon: 'view',
        rowRoot: true,
        listEvent: 'open',
        type: 'vrouter',
        path: '/admin/ais/entrant/' + this._id + '/view',
        access: true
    })

    result.push({
        id: 'admin',
        label: 'Админ',
        roles: ['admin'],
        group: true,
        access: true,
        children: [
            {
                group: true,
                label: 'Import',
                confirm: true,
                type: 'dispatch',
                path: 'edu_ais_entrant/action',
                argsIdMultiple: true,
                args: {
                    action: 'import',
                },
            },
            {
                group: true,
                label: 'Import OVERRIDE',
                confirm: true,
                type: 'dispatch',
                path: 'edu_ais_entrant/action',
                argsIdMultiple: true,
                args: {
                    action: 'import_force',
                },
            },
            {
                group: true,
                label: 'Зачислить',
                confirm: true,
                type: 'dispatch',
                path: 'edu_ais_entrant/action',
                argsIdMultiple: true,
                args: {
                    action: 'zach',
                },
            },
        ],
    })


    result.push({
        id: 'epgu',
        label: 'ЕПГУ',
        roles: ['admin'],
        group: true,
        access: true,
        children: [
            {
                group: true,
                label: 'Add all',
                confirm: true,
                type: 'dispatch',
                path: 'edu_epgu_message/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'createFromEntity',
                    messageType: 'AisServiceEntrantAllAdd',
                    entityType: 'edu_ais_entrant',
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
                            messageType: 'AisServiceEntrantGet',
                            entityType: 'edu_ais_entrant',
                        },
                    },
                    {
                        group: true,
                        label: 'Get by snils',
                        confirm: true,
                        type: 'dispatch',
                        path: 'edu_epgu_message/apiMutate',
                        argsIdMultiple: true,
                        args: {
                            mutation: 'createFromEntity',
                            messageType: 'AisServiceEntrantGetBySnils',
                            entityType: 'edu_ais_entrant',
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
                            messageType: 'AisServiceEntrantAdd',
                            entityType: 'edu_ais_entrant',
                        },
                    },
                    {
                        group: true,
                        label: 'Add address',
                        confirm: true,
                        type: 'dispatch',
                        path: 'edu_epgu_message/apiMutate',
                        argsIdMultiple: true,
                        args: {
                            mutation: 'createFromEntity',
                            messageType: 'AisServiceEntrantEditAddress',
                            entityType: 'edu_ais_entrant',
                        },
                    },
                ],
            },
            {
                group: true,
                label: 'Apps',
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
                            messageType: 'AisServiceEntrantAppsGet',
                            entityType: 'edu_ais_entrant',
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
                            messageType: 'AisServiceEntrantAppsAdd',
                            entityType: 'edu_ais_entrant',
                        },
                    },
                ],
            },
            {
                group: true,
                label: 'Tests',
                children: [
                    {
                        group: true,
                        label: 'Add',
                        confirm: true,
                        type: 'dispatch',
                        path: 'edu_epgu_message/apiMutate',
                        argsIdMultiple: true,
                        args: {
                            mutation: 'createFromEntity',
                            messageType: 'AisServiceEntrantTestResultsAdd',
                            entityType: 'edu_ais_entrant',
                        },
                    },
                    {
                        group: true,
                        label: 'Add multiple',
                        confirm: true,
                        type: 'dispatch',
                        path: 'edu_epgu_message/apiMutate',
                        argsIdMultiple: true,
                        args: {
                            mutation: 'createFromEntities',
                            messageType: 'AisServiceEntrantTestResultsAddMultiple',
                            entityType: 'edu_ais_entrant',
                        },
                    },
                ],
            },
            {
                group: true,
                label: 'Ident',
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
                            messageType: 'AisServiceEntrantGet',
                            entityType: 'edu_ais_entrant',
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
                            messageType: 'AisServiceEntrantIdentAdd',
                            entityType: 'edu_ais_entrant',
                        },
                    },
                ],
            },
            {
                group: true,
                label: 'Edu',
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
                            messageType: 'AisServiceEntrantGet',
                            entityType: 'edu_ais_entrant',
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
                            messageType: 'AisServiceEntrantEduAdd',
                            entityType: 'edu_ais_entrant',
                        },
                    },
                ],
            },
            {
                group: true,
                label: 'Status',
                children: [
                    {
                        group: true,
                        label: 'Set next',
                        confirm: true,
                        type: 'dispatch',
                        path: 'edu_epgu_message/apiMutate',
                        argsIdMultiple: true,
                        args: {
                            mutation: 'createFromEntity',
                            messageType: 'AisServiceEntrantAppsStatusSet',
                            entityType: 'edu_ais_entrant',
                        },
                    },
                    {
                        group: true,
                        label: 'Set next multiple',
                        confirm: true,
                        type: 'dispatch',
                        path: 'edu_epgu_message/apiMutate',
                        argsIdMultiple: true,
                        args: {
                            mutation: 'createFromEntities',
                            messageType: 'AisServiceEntrantAppsStatusSetMultiple',
                            entityType: 'edu_ais_entrant',
                        },
                    },
                ],
            },
        ],
    })

    return result
}
