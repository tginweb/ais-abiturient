const loaders = [
  require('./loaders/components'),
]

export function boot(ctx) {
  loaders.forEach((loader) => {
    loader.boot(ctx);
  })
}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store({modules}) {
  modules.cab = require('./store').default;
}

export function routesCab(routes) {

  Array.prototype.push.apply(routes, [
    {
      path: '/cab/dashboard',
      component: () => import('./routes/dashboard'),
      props: true
    },
  ]);

}

