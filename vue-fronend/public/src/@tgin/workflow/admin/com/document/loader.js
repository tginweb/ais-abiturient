export function boot({Vue}) {

  Vue.component('workflow-admin-document-list-by-entity', require('./component/list-by-entity').default);

}

export function request({Vue, router}) {

}

export function routes(routes) {

  const entityTypes = [
    'document',
  ];

  entityTypes.forEach((type) => {

    const mtype = type + 's'

    routes.push({
      parent: 'admin',
      path: '{parent}/workflow/' + mtype + '/',
      component: () => import('./routes/' + mtype),
      props: true
    })

    routes.push({
      parent: 'admin',
      path: '{parent}/workflow/' + type + '/:entityId',
      component: () => import('./routes/' + type),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    })

    routes.push({
      parent: 'admin',
      path: '{parent}/workflow/' + type + '/:entityId/edit',
      component: () => import('./routes/' + type + '-edit'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    })

    routes.push({
      parent: 'admin',
      path: '{parent}/workflow/' + type + '/create',
      component: () => import('./routes/' + type + '-edit'),
      props: {action: 'create'},
      meta: {
        vroute: {
          enable: true,
        }
      }
    })

  })

}
