export function SCOPE_APP(state, data) {
    Object.assign(state.app, {
        competitions: data.competitions,
    })
}
