
export default {
    label: 'Предметы',
    children: [
        {
            label: 'Есть предметы сдаваемые в ИРНИТУ',
            type: 'filter',
            control: 'q-checkbox',
            model: 'subjectsHaveStatusInternal',
        },
    ]
}
