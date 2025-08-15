export default {
    label: 'Заявление',
    children: [
        {
            label: 'Внесено в АИС',
            type: 'filter',
            control: 'q-checkbox',
            model: 'aisPorted',
        },
        {
            label: 'Внос в АИС поручен операторам',
            type: 'filter',
            control: 'q-checkbox',
            model: 'aisPortedByOperator',
        },
    ]
}