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
  modules.edu_ege = require('./store').default
}

export function scopeQuery(query, name) {

  switch (name) {
    case 'app':

      break
  }

  return query
}


export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      parent: 'admin',
      path: '{parent}/edu/ege/list',
      component: () => import('./routes/items-list'),
    },
    {
      parent: 'admin',
      name: 'edu.ege:packet',
      path: '{parent}/edu/ege/packet',
      props: true,
      component: () => import('./routes/paket'),
      meta: {
        vroute: true
      }
    },
  ]);

}
