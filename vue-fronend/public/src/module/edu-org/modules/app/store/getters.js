export function statusListById(state) {
    return state.app.statusList.reduce((map, item)=>{
        map[item.id] = item
        return map
    }, {})
}
