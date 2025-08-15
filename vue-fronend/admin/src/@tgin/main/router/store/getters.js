const queryString = require('query-string');

export function getPageData(state) {
  return state.pageData
}


export function queryNavPagerUrlTemplate(state, getters, rootState, rootGetters) {

  const params = []

  const path = rootState.route.path

  if (state.queryNav.sort) {
    params.push('sort=' + state.queryNav.sort)
    params.push('asc=' + (state.queryNav.asc ? '1' : '0'))
  }

  params.push('page=%page%')

  return path + '?' + params.join('&')
}


export function vrouterIndex(state) {
  return state.vroutes.length - 1
}

export function vrouterRoute(state) {
  return state.vroutes[state.vroutes.length - 1]
}

export function vrouterRouteName(state, getters) {
  return getters['vrouterRoute'] && getters['vrouterRoute']['name']
}

export function vrouterRouteHashUrl(state, getters) {

  if (!getters.vrouterRoute) return

  const route = getters.vrouterRoute

  if (typeof route.is !== 'string' || !route.hashUrl) return ''

  const res = {
    url: route.is,
    query: route.props
  }

  return '#vroute:' + queryString.stringifyUrl(res)
}

export function vrouterSelectedUid(state) {
  return state.vrouterSelectedUid
}

export function vrouterHaveUrl(state) {
  return (url) => {
    return !!state.vroutes.find(vroute => vroute.url === url)
  }
}

export function pageView(state) {
  return state.currentPageView
}

export function routeForceNative(state) {
  return state.routeForceNative
}

