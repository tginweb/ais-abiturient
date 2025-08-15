

export default function (store) {

    let result = [
        {
            label: 'Любой',
            type: 'filter',
            control: 'q-checkbox',
            model: 'operatorExists',
        }
    ];

    Array.prototype.push.apply(result, store.state.abit.operators.map((item) => {
        return {
            label: item.firstName + ' ' + item.lastName,
            type: 'filter',
            control: 'q-checkbox',
            model: 'operator',
            val: item._id
        }
    }));

    return {
        label: 'Оператор',
        model: 'operator',
        children: result
    }

}