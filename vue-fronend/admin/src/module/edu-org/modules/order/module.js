const loaders = []

export function boot({Vue}) {

}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx)
  })
}

export function store(modules) {
  modules.edu_order = require('./store').default
}

export function scopeQuery(query, name) {

  switch (name) {
    case 'app':
      query = query.add(require('./gql/scope/app.gql'), {})
      break
  }

  return query
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [

    {
      name: 'edu.moodle:list',
      parent: 'admin',
      path: '{parent}/edu/moodle/list',
      component: () => import('./routes/moodle-list'),
      props: true
    },
    {
      name: 'edu.order:list.admin',
      parent: 'admin',
      path: '{parent}/edu/order/admin/list',
      component: () => import('./routes/orders-list-admin'),
      props: true
    },
    {
      name: 'edu.order:list.admin',
      parent: 'admin',
      path: '{parent}/edu/order/admin/sverka',
      component: () => import('./routes/orders-sverka'),
      props: true
    },
    {
      name: 'edu.order:list.operator',
      parent: 'admin',
      path: '{parent}/edu/order/operator/:viewId',
      component: () => import('./routes/orders-list-operator'),
      props: true
    },
    {
      name: 'edu.order:list.fac',
      parent: 'admin',
      path: '{parent}/edu/order/fac/:viewId',
      component: () => import('./routes/orders-list-fac'),
      props: true
    },

    {
      name: 'edu.order:view',
      parent: 'admin',
      path: '{parent}/edu/order/:entityId/view',
      component: () => import('./routes/order-view'),
      props: (route) => {
        return {
          ...route.params,
          ...route.query,
        }
      },
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
      name: 'edu.order:operator-take',
      parent: 'admin',
      path: '{parent}/edu/order/:entityId/take',
      component: () => import('./routes/order-operator-take'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
      name: 'edu.order:set-status',
      parent: 'admin',
      path: '{parent}/edu/order/:entityId/set-status',
      component: () => import('./routes/order-set-status'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
      name: 'edu.order:set-fac',
      parent: 'admin',
      path: '{parent}/edu/order/:entityId/set-fac-first',
      component: () => import('./routes/order-set-fac-first'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    }, 
    {
      name: 'edu.order:set-edu-original',
      parent: 'admin',
      path: '{parent}/edu/order/:entityId/set-edu-original',
      component: () => import('./routes/order-set-edu-original'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
      name: 'edu.order:change-user',
      parent: 'admin',
      path: '{parent}/edu/order/:entityId/change-user',
      component: () => import('./routes/order-change-user'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
      name: 'edu.order:apps-add',
      parent: 'admin',
      path: '{parent}/edu/order/:entityId/apps-add',
      component: () => import('./routes/order-app-add'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },

    {
      name: 'edu.order:set-operator',
      parent: 'admin',
      path: '{parent}/edu/orders/set-operator',
      component: () => import('./routes/orders-set-operator'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
      name: 'edu.order:set-fac',
      parent: 'admin',
      path: '{parent}/edu/orders/set-fac',
      component: () => import('./routes/orders-set-institute'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
      name: 'edu.order:set-decree',
      parent: 'admin',
      path: '{parent}/edu/orders/set-decree',
      component: () => import('./routes/orders-set-decree'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },

    {
      name: 'edu.order:add',
      parent: 'admin',
      path: '{parent}/edu/order/add',
      component: () => import('./routes/order-add'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
  ]);

}
