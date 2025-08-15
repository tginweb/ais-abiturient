const loaders = [

]

export function boot({Vue}) {
  Vue.component('edu-ss-competition-list-view', () => import('./routes/competition-list/item-view'))
  Vue.component('edu-ss-competition-list-snap-view', () => import('./routes/competition-list-snap/item-view'))
}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store(modules) {
  modules.edu_ss_competition_list = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [

    {
      parent: 'admin',
      path: '/admin/edu-epgu/ss-competition-list/list',
      component: () => import('./routes/competition-list/items-list'),
    },
    {
      parent: 'admin',
      path: '/admin/edu-epgu/ss-competition-list/:entityId/view',
      component: () => import('./routes/competition-list/item-view'),
      props: true,
      meta: {
        vroute: {
          enable: true,
          is: 'edu-ss-competition-list-view',
        }
      }
    },

    {
      parent: 'admin',
      path: '/admin/edu-epgu/ss-competition-list-snap/list',
      component: () => import('./routes/competition-list-snap/items-list'),
    },
    {
      parent: 'admin',
      path: '/admin/edu-epgu/ss-competition-list-snap/:entityId/view',
      component: () => import('./routes/competition-list-snap/item-view'),
      props: true,
      meta: {
        vroute: {
          enable: true,
          is: 'edu-ss-competition-list-snap-view',
        }
      }
    },

  ])

}
