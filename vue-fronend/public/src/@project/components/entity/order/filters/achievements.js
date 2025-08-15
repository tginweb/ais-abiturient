export default function (store) {

    let result = [
        {
            label: 'Есть любые',
            type: 'filter',
            control: 'q-checkbox',
            model: 'achievementsExists',
        }
    ];

    Array.prototype.push.apply(result, store.state.abit.terms.achievementType.map((item) => {
        return {
            label: item.fields.eduType + ': ' + item.name,
            type: 'filter',
            control: 'q-checkbox',
            model: 'achievements',
            val: item.nid
        }
    }));

    return {
        label: 'ИД',
        model: 'achievements',
        children: result
    }
}