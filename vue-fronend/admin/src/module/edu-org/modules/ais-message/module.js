const loaders = [

]

export function boot({Vue}) {
  //Vue.component('edu-org-dictionary-sync', () => import('./routes/sync'))
}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store(modules) {
  modules.edu_ais_message = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      name: 'edu.ais.message:create',
      parent: 'admin',
      path: '{parent}/ais/message/create',
      component: () => import('./routes/create'),
      meta: {
        vroute: {
          enable: true,
        }
      }
    },

    {
      parent: 'admin',
      path: '{parent}/ais/message/list',
      component: () => import('./routes/items'),
    },

    {
      parent: 'admin',
      path: '{parent}/ais/message/:entityId/view',
      component: () => import('./routes/item-view'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },

  ]);

}
