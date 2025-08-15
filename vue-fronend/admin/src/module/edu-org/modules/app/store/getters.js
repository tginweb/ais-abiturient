export function statusesById(state) {
    return state.app.statusList.reduce((map, item)=>{
        map[item.id] = item
        return map
    }, {})
}
