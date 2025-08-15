export default {


    computed: {},

    methods: {

        getEpguFilters() {
            return [
                {
                    type: 'group',
                    label: 'ЕПГУ',
                    path: 'epgu',
                    children: [
                        {
                            type: 'boolean',
                            path: 'epgu.exported',
                            label: 'Выгружен',
                            op: 'eq',
                        },
                        {
                            label: 'Шаг',
                            type: 'string',
                            path: 'epgu.step',
                            control: 'options',
                            multitple: true,
                            op: 'in',
                            options: [
                                {label: 'queued', value: 'queued'},
                                {label: 'process', value: 'process'},
                                {label: 'processed', value: 'processed'},
                            ]
                        },
                        {
                            label: 'Статус',
                            type: 'string',
                            path: 'epgu.status',
                            control: 'options',
                            multitple: true,
                            op: 'in',
                            options: [
                                {label: 'success', value: 'success'},
                                {label: 'error', value: 'error'},
                                {label: 'await', value: 'await'},
                                {label: 'process', value: 'process'},
                            ]
                        },
                    ]
                },
            ]
        },


        getEpguColumns() {
            return [
                {
                    name: 'epgu.exported',
                    label: 'ЕПГУ выгружен',
                    field: 'epgu.exported',
                    sortable: true,
                },
                {
                    name: 'epgu.step',
                    label: 'ЕПГУ шаг',
                    field: 'epgu.step',
                    sortable: true,
                },
                {
                    name: 'epgu.status',
                    label: 'ЕПГУ статус',
                    field: (row) => row.epgu.status + '<br>' + (row.epgu.statusMessage || ''),
                    sortable: true,
                }
            ]
        }
    },
}

