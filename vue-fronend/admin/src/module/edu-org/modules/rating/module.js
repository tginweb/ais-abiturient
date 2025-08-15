const loaders = [

]

export function boot({Vue}) {

}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store(modules) {
  modules.edu_rating = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      name: 'edu.rating:list',
      parent: 'admin',
      path: '{parent}/edu/rating/list',
      component: () => import('./routes/list'),
    },
    {
      name: 'edu.rating:edit',
      parent: 'admin',
      path: '{parent}/edu/rating/:entityId/edit',
      component: () => import('./routes/view'),
      props: (route) => {
        return {
          ...route.params,
          action: 'edit'
        }
      },
      meta: {
        vroute: true
      }
    },
    {
      name: 'edu.rating:create',
      parent: 'admin',
      path: '{parent}/edu/rating/create',
      component: () => import('./routes/view'),
      props: (route) => {
        return {
          action: 'create',
          ...(route.params || {})
        }
      },
      meta: {
        vroute: true
      }
    },
  ]);
}
