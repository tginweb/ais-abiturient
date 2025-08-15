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
    case 'user':
      query = query.add(require('./gql/scope/user.gql'), {})
      break
  }

  return query
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      name: 'edu.order:change-type',
      parent: 'cab',
      path: '{parent}/order/change-type',
      component: () => import('./routes/change-order-type'),
      props: true,
      meta: {
        vroute: true
      }
    },

    {
      name: 'edu.order:view',
      parent: 'cab',
      path: '{parent}/order/view',
      component: () => import('./routes/view'),
      props: true,
    },

    {
      name: 'edu.order:step-anket',
      parent: 'cab',
      path: '{parent}/order/step/anket',
      component: () => import('./routes/step/anket'),
      props: true,
    },
    {
      name: 'edu.order:step-entrance',
      parent: 'cab',
      path: '{parent}/order/step/entrance',
      component: () => import('./routes/step/entrance'),
      props: true,
    },
    {
      name: 'edu.order:step-applications',
      parent: 'cab',
      path: '{parent}/order/step/applications',
      component: () => import('./routes/step/apps'),
      props: true,
    },
    {
      name: 'edu.order:step-upload',
      parent: 'cab',
      path: '{parent}/order/step/upload',
      component: () => import('./routes/step/upload'),
      props: true,
    },

    {
      name: 'edu.order:family-edit',
      parent: 'cab',
      path: '{parent}/order/anket/family-edit',
      component: () => import('./routes/family-edit'),
      props: true,
      meta: {
        vroute: true
      }
    },
    {
      name: 'edu.order:app-add',
      parent: 'cab',
      path: '{parent}/order/app/add',
      component: () => import('./routes/app-add'),
      props: true,
      meta: {
        vroute: true
      }
    },
    {
      name: 'edu.order:app-add-admission',
      parent: 'cab',
      path: '{parent}/order/app/add-admission',
      component: () => import('./routes/app-add-admission'),
      props: true,
      meta: {
        vroute: true
      }
    },

    {
      name: 'edu.order:achievement-edit',
      parent: 'cab',
      path: '{parent}/order/achievement/:entityId/edit',
      component: () => import('./routes/achievement-edit'),
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
      name: 'edu.order:achievement-create',
      parent: 'cab',
      path: '{parent}/order/achievement/add',
      component: () => import('./routes/achievement-edit'),
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


    {
      name: 'edu.order:quota-edit',
      parent: 'cab',
      path: '{parent}/order/quota/:action',
      component: () => import('./routes/quota-edit'),
      props: (route) => {
        return {
          ...route.params
        }
      },
      meta: {
        vroute: true
      }
    },

  ]);

}
