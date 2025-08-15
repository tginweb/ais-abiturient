
export default function (store) {
    return {
        label: 'Набор 1пр',
        model: 'programFirst',
        children: store.getters['abit/eduProgramsPrepared'].map((item) => {
            return {
                label: item.abbr,
                type: 'filter',
                control: 'q-checkbox',
                model: 'programFirst',
                val: item.nid
            }
        })
    }
}