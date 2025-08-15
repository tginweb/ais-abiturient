export default function () {
  return {
    pageData: {},
    pageRouteData: {},
    pageInfo: {},

    route: {
      path: null
    },

    queryNav: {
      path: null,
      page: 1,
      sort: null,
      asc: null,
    },

    t: 123,

    backLink: {
      url: '',
      title: ''
    },

    vroutesGid: 0,
    vroutes: [],

    vrouterSelectedUid: null,
    vrouterSelectedOrder: 100,

    currentPageView: {},

    routeForceNative: false
  }
}
