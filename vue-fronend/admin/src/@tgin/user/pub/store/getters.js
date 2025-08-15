export function widgetsDefault(state, getters, rootState, rootGetters) {
    return [

    ]
}

export function widgetProfile(state, getters, rootState) {
    return {
        id: 'user:personal.profile',
        groups: ['personal'],
        colClass: 'col-24 col-xl-12',
        is: () => import('../component/profile/widget/widget-profile')
    }
}
