export function byUid(state) {
    return state.app.competitions.reduce((map, item)=>{
        map[item.uid] = item
        return map
    }, {})
}
