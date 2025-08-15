export function SCOPE_USER(state, data) {
    if (data.userNotices) {
        Object.assign(state.user, {
            notices: data.userNotices,
        })
    }
}
