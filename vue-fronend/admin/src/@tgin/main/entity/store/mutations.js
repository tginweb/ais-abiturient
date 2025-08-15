export function SCOPE_APP(state, data) {
    Object.assign(state.app, {
        typesInfo: data.typesInfo,
    })
}

