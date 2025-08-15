export default function (store) {
    return {
        label: 'Институт',
        model: 'institute',
        children: store.getters['abit/termsEduInstituteUsed'].map((item) => {
            return {
                label: item.name,
                type: 'filter',
                control: 'q-checkbox',
                model: 'institute',
                val: item.nid
            }
        })
    }
}