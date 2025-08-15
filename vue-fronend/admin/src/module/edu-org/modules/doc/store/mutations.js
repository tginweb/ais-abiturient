export function SCOPE_APP(state, data) {
    Object.assign(state.app, {
        roles: data.roles,
        statuses: data.statuses,
        docCategories: data.docCategories,
        docTypes: data.docTypes,
    })
}


