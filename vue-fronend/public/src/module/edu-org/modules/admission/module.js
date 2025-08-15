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
  modules.edu_admission = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      name: 'edu.admission:list',
      parent: 'admin',
      path: '{parent}/edu/admission/list',
      component: () => import('./routes/list'),
    },
    {
      parent: 'admin',
      path: '{parent}/edu/admission/add',
      component: () => import('./routes/add'),
    },
    {
      parent: 'admin',
      path: '{parent}/edu/admission/sync',
      component: () => import('./routes/admissions-sync'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
      parent: 'admin',
      path: '{parent}/edu/admission/:entityId/view',
      component: () => import('./routes/admission-view'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
    {
      parent: 'admin',
      path: '{parent}/edu/admission/:entityId/edit',
      component: () => import('./routes/admission-edit'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
  ]);

}
