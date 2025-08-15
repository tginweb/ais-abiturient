export default function (store) {
    return {
        label: 'Набор',
        model: 'program',
        children: store.getters['abit/eduProgramsPrepared'].map((item) => {
            return {
                label: item.abbr,
                type: 'filter',
                control: 'q-checkbox',
                model: 'program',
                val: item.nid
            }
        })
    }
}