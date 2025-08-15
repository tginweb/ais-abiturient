export default {
    label: 'Чат',
    children: [
        {
            label: 'Новые сообщения от клиента',
            type: 'filter',
            control: 'q-checkbox',
            model: 'haveUnreadedByCompanyMessages',
        },
        {
            label: 'Сообщения от клиента',
            type: 'filter',
            control: 'q-checkbox',
            model: 'haveClientMessages',
        },
        {
            label: 'Сообщения от ИРНИТУ',
            type: 'filter',
            control: 'q-checkbox',
            model: 'haveCompanyMessages',
        }
    ]
}