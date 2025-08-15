
export default {
    label: 'Фильтр оператора',
    expanded: true,
    children: [
        {
            expandable: false,
            selectable: false,
            label: 'Свои',
            type: 'filter',
            control: 'q-radio',
            model: 'mode',
            val: 'own'
        },
        {
            expandable: false,
            selectable: false,
            label: 'Очередь',
            type: 'filter',
            control: 'q-radio',
            model: 'mode',
            val: 'queue'
        },
        {
            expandable: false,
            selectable: false,
            label: 'Очередь поручений внос в АИС',
            type: 'filter',
            control: 'q-radio',
            model: 'mode',
            val: 'aisPort'
        },
    ]
}
