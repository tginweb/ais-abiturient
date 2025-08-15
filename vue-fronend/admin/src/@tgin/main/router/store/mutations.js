import Vue from 'vue';

function getRoutesMaxOrder(items) {
    return Math.max(...items.map(item => item.order)) || 0
}

export function assignPageData(state, data) {
    for (let key in data) {
        Vue.set(state.pageData, key, data[key])
    }
}

export function setPageData(state, data) {
    Vue.set(state, 'pageData', {})
    Object.assign(state.pageData, data)
}

export function setPageRouteData(state, data) {
    Vue.set(state.pageRouteData, data.path, data.data)
}

export function SET_BACK_LINK(state, data) {
    Object.assign(state.backLink, data)
}

export function SET_PAGE_INFO(state, data) {
    Vue.set(state, 'pageInfo', {})
    Object.assign(state.pageInfo, data)
}

export function QUERY_NAV(state, data) {
    Object.assign(state.queryNav, data)
}

export function ROUTE(state, data) {
    Object.assign(state.route, data)
}


export function VROUTER_PUSH_AFTER(state, {after, data}) {
    data.uid = data.uid || state.vroutesGid++
    if (typeof after !== "undefined") {
        state.vroutes.splice(after + 1, 100, data);
    } else {
        state.vroutes.push(data)
    }
}

export function VROUTER_PUSH(state, data) {

    state.vrouterSelectedOrder++

    const cdata = {
        uid: state.vroutesGid++,
        order: state.vrouterSelectedOrder,
        ...data,
    }

    state.vrouterSelectedUid = cdata.uid

    state.vroutes.push(cdata)
}

export function VROUTER_REPLACE(state, data) {

    if (state.vroutes.length) {
        state.vroutes.splice(-1, 1)
    }

    state.vrouterSelectedOrder++

    const cdata = {
        uid: state.vroutesGid++,
        order: state.vrouterSelectedOrder,
        ...data,
    }

    state.vrouterSelectedUid = cdata.uid

    state.vroutes.push(cdata)
}

export function VROUTER_CLOSE(state, data) {
    state.vroutes.splice(-1, 1)
}

export function VROUTER_SELECT(state, uid) {

    console.log('VROUTER_SELECT')

    if (state.vrouterSelectedUid === uid)
        return

    state.vrouterSelectedUid = uid
    state.vrouterSelectedOrder++

    const route = state.vroutes.find(item => item.uid === uid)

    if (route)
        route.order = state.vrouterSelectedOrder

    /*
    state.vroutes.forEach(item => {
        item.selected = item.uid === uid
    })

     */
}

export function SET_PAGE_VIEW(state, data) {

    state.currentPageView = data
}


export function setRouteForceNative(state, data) {
    state.routeForceNative = data
}
