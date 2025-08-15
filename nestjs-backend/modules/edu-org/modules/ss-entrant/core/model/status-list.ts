
export const ssEntrantStatusList = [
    {
        code: 'sended',
        titleClient: 'Отправлено в ИРНИТУ: ожидает рассмотрения',
        titleAdmin: 'Ожидает рассмотрения',
        bgColor: '#eebc00',
        textColor: '#ffffff',
        color: '#d5ad00',
        index: 2,
        canEdit: false,
        selectable: true,
    },
    {
        code: 'accepted',
        titleClient: 'Принято: Участвует в конкурсе',
        titleAdmin: 'Принято: Участвует в конкурсе',
        bgColor: '#1ca834',
        textColor: '#ffffff',
        color: '#1ca834',
        index: 20,
        canEdit: false,
        selectable: true,
        appStatus: 8,
    },
    {
        code: 'canceled',
        titleClient: 'Отозвано: Не участвует в конкурсе',
        titleAdmin: 'Отозвано: Не участвует в конкурсе',
        bgColor: '#ee4822',
        textColor: '#ffffff',
        color: '#ee4822',
        index: 40,
        canEdit: false,
        selectable: true,
        appStatus: 8,
    },
]

export const ssEntrantStatusListById = ssEntrantStatusList.reduce((map, o) => (map[o.code] = o, map), {})
