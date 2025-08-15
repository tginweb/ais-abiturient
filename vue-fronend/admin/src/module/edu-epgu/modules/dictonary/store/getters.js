export function docTypesByCat(state) {
    return (state.dictionary.DocumentTypeCls || []).reduce((map, item) => {
        if (!map[item.IdCategory])
            map[item.IdCategory] = []
        map[item.IdCategory].push(item)
        return map
    }, {})
}

export function docTypeById(state) {
    return (state.dictionary.DocumentTypeCls || []).reduce((map, item) => {
        map[item.id] = item
        return map
    }, {})
}
