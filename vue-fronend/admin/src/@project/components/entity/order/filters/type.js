export default function (store) {
    return {
        label: 'Тип заявления',
        model: 'eduType',
        children: store.getters['abit/terms'].eduType.map((item) => {
            return {
                label: item.name,
                type: 'filter',
                control: 'q-checkbox',
                model: 'eduType',
                val: item.nid
            }
        })
    }
}