export default function (store) {

    let result = [
        {
            label: 'Есть любые',
            type: 'filter',
            control: 'q-checkbox',
            model: 'quotesExists',
        }
    ];

    Array.prototype.push.apply(result, store.state.abit.terms.eduQuota.map((item) => {
        return {
            label: item.name,
            type: 'filter',
            control: 'q-checkbox',
            model: 'quotes',
            val: item.nid
        }
    }));

    return {
        label: 'Льготы',
        model: 'quotes',
        children: result
    }
}