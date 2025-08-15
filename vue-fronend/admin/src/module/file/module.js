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
  modules.file = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      parent: 'admin',
      path: '{parent}/file/list',
      component: () => import('./routes/recordset'),
    },
    {
      parent: 'admin',
      path: '{parent}/file/:entityId/view',
      component: () => import('./routes/detail'),
      props: true,
      meta: {
        vroute: {
          enable: true,
        }
      }
    },
  ]);

}
