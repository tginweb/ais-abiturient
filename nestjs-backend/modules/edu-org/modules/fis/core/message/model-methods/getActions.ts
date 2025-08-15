import {EduFisMessageModel} from "~modules/edu-org/modules/fis/core/message/model";

export default function getActions(this: EduFisMessageModel) {

    const result = []

    result.push({
        id: 'view',
        label: 'Просмотр',
        listEvent: 'open',
        icon: 'view',
        rowRoot: true,
        type: 'vrouter',
        path: '/admin/edu-fis/message/' + this.id + '/view'
    })

    result.push({
        id: 'process',
        label: 'Процесс',
        group: true,
        type: 'dispatch',
        path: 'edu_fis_message/apiMutate',
        argsIdMultiple: true,
        args: {
            mutation: 'action',
            action: 'process'
        }
    })

    result.push({
        id: 'step',
        group: true,
        label: 'Шаг',
        children: [
            {
                label: 'Send',
                type: 'dispatch',
                path: 'edu_fis_message/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'process',
                    step: 'send'
                }
            },
            {
                label: 'Fetch',
                type: 'dispatch',
                path: 'edu_fis_message/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'process',
                    step: 'fetch'
                }
            },
            {
                label: 'Process',
                type: 'dispatch',
                path: 'edu_fis_message/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'action',
                    action: 'process',
                    step: 'process'
                }
            },
        ]
    })

    if (!this.archive)
        result.push({
            id: 'archive',
            label: 'В архив',
            group: true,
            confirm: true,
            type: 'dispatch',
            path: 'edu_fis_message/apiMutate',
            argsIdMultiple: true,
            args: {
                mutation: 'action',
                action: 'archive'
            }
        })
    else
        result.push({
            id: 'unarchive',
            label: 'Из архива',
            group: true,
            confirm: true,
            type: 'dispatch',
            path: 'edu_fis_message/apiMutate',
            argsIdMultiple: true,
            args: {
                mutation: 'action',
                action: 'unarchive'
            }
        })

    result.push({
        id: 'delete',
        label: 'Удалить',
        group: true,
        type: 'dispatch',
        path: 'edu_fis_message/apiMutate',
        argsIdMultiple: true,
        args: {
            mutation: 'action',
            action: 'delete'
        }
    })

    return result
}
