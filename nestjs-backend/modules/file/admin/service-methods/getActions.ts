import {FileAdminService} from "../service";
import {UserModel} from "~modules/user/core/model/user.model";
import {FileModel} from "~modules/file/core/model";

export default async function (this: FileAdminService, entity: FileModel, user: UserModel) {

    const result = []

    result.push({
        name: 'view',
        label: 'Просмотр',
        icon: 'view',
        rowRoot: true,
        listEvent: 'open',
        type: 'vrouter',
        path: '/admin/edu/order/' + entity.nid + '/view',
        access: true
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
                label: 'Get',
                confirm: true,
                type: 'dispatch',
                path: 'edu_epgu_message/apiMutate',
                argsIdMultiple: true,
                args: {
                    mutation: 'createFromEntity',
                    messageType: 'DocumentGet',
                    entityType: 'file',
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
                    messageType: 'DocumentAdd',
                    entityType: 'file',
                },
            },
        ],
    })


    return result.filter(item => {

        if (item.roles && item.roles.length && !item.roles.filter(value => user.roles.includes(value)).length) return false

        return item.access
    })
}
