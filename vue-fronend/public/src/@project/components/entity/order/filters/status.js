export default function (store) {
    return {
        label: 'Статус',
        children: store.getters['abit/orderStatusesInfo'].map((item) => {
            return {
                label: item.titleAdmin,
                type: 'filter',
                control: 'q-checkbox',
                model: 'status',
                val: item.code
            }
        })
    }
}