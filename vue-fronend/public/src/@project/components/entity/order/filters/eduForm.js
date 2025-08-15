
export default {
    label: 'Форма обучения',
    expanded: true,
    children: [
        {
            expandable: false,
            selectable: false,
            label: 'Очная',
            type: 'filter',
            control: 'q-radio',
            model: 'eduForm',
            val: 1
        },
        {
            expandable: false,
            selectable: false,
            label: 'Заочная',
            type: 'filter',
            control: 'q-radio',
            model: 'eduForm',
            val: 2
        },
        {
            expandable: false,
            selectable: false,
            label: 'Вечерняя',
            type: 'filter',
            control: 'q-radio',
            model: 'eduForm',
            val: 3
        },
    ]
}
