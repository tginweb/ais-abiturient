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
  modules.edu_sheet = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      name: 'edu.sheet:list',
      parent: 'admin',
      path: '{parent}/edu/sheet/list',
      component: () => import('./routes/list'),
    },
    {
      name: 'edu.sheet:add-tests',
      parent: 'admin',
      path: '{parent}/edu/sheet/add-tests',
      component: () => import('./routes/add-tests'),
      props: (route) => {
        return {
          ...route.params,
        }
      },
      meta: {
        vroute: true
      }
    },
    {
      name: 'edu.sheet:edit',
      parent: 'admin',
      path: '{parent}/edu/sheet/:entityId/edit',
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
      name: 'edu.sheet:create',
      parent: 'admin',
      path: '{parent}/edu/sheet/create',
      component: () => import('./routes/view'),
      props: (route) => {
        return {
          orderId: route.query.orderId,
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
