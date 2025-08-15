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
  modules.edu_epgu_message = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      name: 'edu.epgu.message:create',
      parent: 'admin',
      path: '{parent}/edu-epgu/message/create',
      component: () => import('./routes/create'),
      meta: {
        vroute: {
          enable: true,
        }
      }
    },

    {
      parent: 'admin',
      path: '{parent}/edu-epgu/messages/archive',
      component: () => import('./routes/items-history'),
    },
    {
      parent: 'admin',
      path: '{parent}/edu-epgu/messages/active/service',
      component: () => import('./routes/items-active-service'),
    },
    {
      parent: 'admin',
      path: '{parent}/edu-epgu/messages/active/epgu',
      component: () => import('./routes/items-active-epgu'),
    },
    {
      parent: 'admin',
      path: '{parent}/edu-epgu/message/:entityId/view',
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
