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
  modules.edu_competition = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      name: 'edu.competition:list',
      parent: 'admin',
      path: '{parent}/edu/competition/list',
      component: () => import('./routes/list'),
    },
    {
      parent: 'admin',
      path: '{parent}/edu/competition/:entityId/view',
      component: () => import('./routes/view'),
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
      component: () => import('./routes/edit'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
  ]);

}
