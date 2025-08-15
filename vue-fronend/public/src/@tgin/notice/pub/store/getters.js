export function userNoticesNew(state, getters, rootState) {
    return state.user.notices
}

export function userNoticesUnreaded(state, getters, rootState) {
    return getters.userNoticesNew.filter(item => !item.READED)
}

export function userNoticesUnreadedCount(state, getters, rootState) {
    return getters.userNoticesUnreaded.length
}
