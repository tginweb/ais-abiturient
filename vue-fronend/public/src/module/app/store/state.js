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

    pubMenuShort: [
      {
        to: 'https://cis.istu.edu/served/rating.php',
        label: 'Списки поступающих',
      },
    ],
    pubMenu: [
      {
        to: 'https://cis.istu.edu/served/rating.php',
        label: 'Списки поступающих',
      },
      {
        to: 'http://www.istu.edu/abiturientu/nabor_2023/sroki',
        label: 'Сроки подачи документов',
      },
      {
        to: 'http://www.istu.edu/abiturientu/nabor_2023/pravila_priema',
        label: 'Правила приема',
      },
      {
        to: 'http://www.istu.edu/abiturientu/exameny',
        label: 'Вступительные испытания',
      },
    ]

  }
}
