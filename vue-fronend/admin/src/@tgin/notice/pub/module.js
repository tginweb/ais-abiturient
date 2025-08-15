export function register(ctx) {
  return {
    entityType: 'review',
    routeFolder: '/review',
    routeParent: 'public',
    title: 'Отзыв',
    titlePlural: 'Отзывы',
    ...ctx,
  }
}

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

export function store(modules) {
  modules.notice_pub = require('./store').default;
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      parent: 'personal',
      path: '{parent}/notices/:entityId?',
      props: true,
      component: () => import('./routes/personal/notices')
    },
  ]);
}


export function scopeQuery(query, name) {

  switch (name) {
    case 'user':
      query = query.add(require('./gql/scope/user.gql'), {})
      break
  }

  return query
}
