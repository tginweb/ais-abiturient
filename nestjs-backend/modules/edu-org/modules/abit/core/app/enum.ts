

export enum AbitAppCancelDecisionSide {
    ABIT = 'abit',
    ORG = 'org',
}

export enum AppStatusEnum {
    NEW = 1,
    RECEIVED = 2,
    PENDING = 4,
    COMPET_MEMBER = 8,
    COMPET_NOPASS = 10,
    INORDER = 11,
    CANCELED_ORG = 12,
    CANCELED_ENROLL = 14,
    CANCELED_ABIT = 15,
    STUDENT = 19
}

export const appStatusList = [
    {
        id: AppStatusEnum.NEW,
        title: 'Новое',
        availableStatuses: [
            AppStatusEnum.RECEIVED,
            AppStatusEnum.PENDING,
            AppStatusEnum.COMPET_MEMBER,
            AppStatusEnum.CANCELED_ORG,
            AppStatusEnum.CANCELED_ABIT
        ],
        color: '#937906'
    },
    {
        id: AppStatusEnum.RECEIVED,
        title: 'Получено вузом',
        availableStatuses: [
            AppStatusEnum.PENDING,
            AppStatusEnum.COMPET_MEMBER,
            AppStatusEnum.CANCELED_ORG,
            AppStatusEnum.CANCELED_ABIT
        ],
        color: '#937906'
    },
    {
        id: AppStatusEnum.PENDING,
        title: 'Рассмотрение заявления',
        availableStatuses: [
            AppStatusEnum.COMPET_MEMBER,
            AppStatusEnum.CANCELED_ORG,
            AppStatusEnum.CANCELED_ABIT
        ],
        color: '#937906'
    },
    {
        id: AppStatusEnum.COMPET_MEMBER,
        title: 'Участвует в конкурсе',
        availableStatuses: [
            AppStatusEnum.CANCELED_ORG,
            AppStatusEnum.CANCELED_ABIT,
            AppStatusEnum.INORDER,
        ],
        color: '#17490f'
    },
    {
        id: AppStatusEnum.COMPET_NOPASS,
        title: 'Не прошло по конкурсу',
        availableStatuses: [],
        color: '#9d0505'
    },
    {
        id: AppStatusEnum.INORDER,
        title: 'Включено в приказ на зачисление',
        availableStatuses: [
            AppStatusEnum.STUDENT,
            AppStatusEnum.COMPET_MEMBER,
        ],
        color: '#05289d'
    },
    {
        id: AppStatusEnum.CANCELED_ORG,
        title: 'Отклонено вузом',
        availableStatuses: [],
        canceled: true,
        color: '#9d0505'
    },
    {
        id: AppStatusEnum.CANCELED_ENROLL,
        title: 'Отказ от зачисления',
        availableStatuses: [],
        canceled: true,
        color: '#9d0505'
    },
    {
        id: AppStatusEnum.CANCELED_ABIT,
        title: 'Отзыв заявления абитуриентом',
        availableStatuses: [],
        canceled: true,
        color: '#9d0505'
    },
    {
        id: AppStatusEnum.STUDENT,
        title: 'Зачислен',
        availableStatuses: [],
        color: '#05289d'
    },
]

export const appStatusListById = appStatusList.reduce((map, o) => (map[o.id] = o, map), {})
