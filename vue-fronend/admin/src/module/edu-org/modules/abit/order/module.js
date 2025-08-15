const loaders = []

export function boot({Vue}) {

}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
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
      name: 'edu.order:apps-set-status',
      parent: 'admin',
      path: '{parent}/edu/order/apps-set-status',
      component: () => import('./routes/order-apps-set-status'),
      props: true
    },
    {
      name: 'edu.order:list.admin',
      parent: 'admin',
      path: '{parent}/edu/order/admin/list',
      component: () => import('./routes/orders-admin-list'),
      props: true
    },
    {
      name: 'edu.order:sverka.admin',
      parent: 'admin',
      path: '{parent}/edu/order/admin/sverka',
      component: () => import('./routes/orders-admin-sverka'),
      props: true
    },
    {
      name: 'edu.order:stat.admin',
      parent: 'admin',
      path: '{parent}/edu/order/admin/stat',
      component: () => import('./routes/orders-admin-stat'),
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
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
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
      parent: 'admin',
      path: '{parent}/edu/order/:entityId/set-ais-ported',
      component: () => import('./routes/order-set-ais-ported'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
      parent: 'admin',
      path: '{parent}/edu/order/:entityId/set-ais-toport',
      component: () => import('./routes/order-set-ais-toport'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },

    {
      parent: 'admin',
      path: '{parent}/edu/order/:entityId/set-agreement-changed-processed',
      component: () => import('./routes/order-set-agreement-changed-processed'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },

    {
      parent: 'admin',
      path: '{parent}/edu/order/fis/ege/export',
      component: () => import('./routes/orders-fis-ege-packet-export'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
      parent: 'admin',
      path: '{parent}/edu/order/fis/ege/import',
      component: () => import('./routes/orders-fis-ege-packet-import'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
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
      name: 'edu.order:ais.import',
      parent: 'admin',
      path: '{parent}/edu/order/ais-upload',
      component: () => import('./routes/orders-ais-upload'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
  ]);

}
