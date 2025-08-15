const loaders = []

export function boot({Vue}) {
  Vue.component('edu-epgu-task-add', () => import('./routes/task-add'))
  Vue.component('edu-epgu-task-view', () => import('./routes/task-view'))
}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store({modules}) {
  modules.edu_epgu_task = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      path: '/cab/edu-epgu/task/list/active',
      component: () => import('./routes/task-list-active'),
    },
    {
      path: '/cab/edu-epgu/task/add',
      component: () => import('./routes/task-add'),
      props: true,
      meta: {
        vroute: {
          enable: true,
          is: 'edu-epgu-task-add',
        }
      }
    },
    {
      path: '/cab/edu-epgu/task/:entityId/view',
      component: () => import('./routes/task-view'),
      props: true,
      meta: {
        vroute: {
          enable: true,
          is: 'edu-epgu-task-view',
        }
      }
    },
  ]);

}

