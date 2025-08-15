
import * as messageTypes from "../type";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";

export default async function (this: EduEpguMessageModel) {

    const schema = [
        {
            type: 'group',
            label: 'Сообщение',
            path: 'message',
            children: [
                {
                    type: 'number',
                    path: 'id',
                    label: 'ID',
                    op: 'eq'
                },
                {
                    type: 'number',
                    path: 'idJwt',
                    label: 'idJwt',
                    op: 'eq'
                },
                {
                    type: 'string',
                    path: 'entityTarget',
                    label: 'entityTarget',
                    op: 'like'
                },
            ]
        },
        {
            type: 'group',
            label: 'Хедер',
            path: 'header',
            children: [
                {
                    type: 'string',
                    control: 'options',
                    path: 'type',
                    label: 'messageType',
                    multitple: true,
                    op: 'in',
                    options: Object.keys(messageTypes).map(type => {
                        return {
                            value: type,
                            label: type
                        }
                    })
                },
            ],
        },
        {
            type: 'group',
            label: 'Ответ',
            path: 'response',
            children: [
                {
                    type: 'string',
                    path: 'response.payloadXml',
                    label: 'PayloadXml',
                    op: 'like'
                },
            ],
        },
        {
            type: 'group',
            label: 'Состояние',
            path: 'state',
            children: [
                {
                    type: 'string',
                    control: 'options',
                    path: 'state.step',
                    label: 'Step',
                    multitple: true,
                    op: 'in',
                    options: [
                        {value: 'send', label: 'Send'},
                        {value: 'fetch', label: 'Fetch'},
                        {value: 'process', label: 'Process'},
                        {value: 'done', label: 'Done'},
                    ]
                },
                {
                    type: 'string',
                    control: 'options',
                    path: 'state.status',
                    label: 'Status',
                    multitple: true,
                    op: 'in',
                    options: [
                        {value: 'await', label: 'Await'},
                        {value: 'success', label: 'Success'},
                        {value: 'error', label: 'Error'},
                    ]
                },
                {
                    type: 'boolean',
                    label: 'Обработан',
                    path: 'state.processed',
                    op: 'eq',
                }
            ],
        },
    ]

    return schema
}
