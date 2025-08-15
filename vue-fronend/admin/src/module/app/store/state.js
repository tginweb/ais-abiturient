export default function () {
  return {
    siteMode: '',
    specialMode: false,

    session: {},

    terms: [],

    contextLoaded: false,

    page: {
      breadcrumbs: [],
      viewModes: [],
      viewMode: null,
    },

    dialog: {
      'drawer-left': {value: true},
      search: {value: false},
      player: {value: false},
      login: {value: false},
      mview: {value: false},
      gallery: {value: false},
      lightbox: {value: false},
    },

    scopes: {
      app: {
        fetched: false,
      }
    },

  }
}
