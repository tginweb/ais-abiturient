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
  modules.edu_source = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      parent: 'admin',
      path: '{parent}/edu/source/list',
      component: () => import('./routes/items-list'),
    },
  ]);

}
