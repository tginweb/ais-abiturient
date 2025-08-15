const loaders = [

]

export function boot({Vue}) {
  Vue.component('edu-epgu-doc-field-character', require('./component/field/character').default)
  Vue.component('edu-epgu-doc-field-integer', require('./component/field/integer').default)
  Vue.component('edu-epgu-doc-field-date', require('./component/field/date').default)
}

export async function request(ctx) {
  loaders.forEach((loader) => {
    loader.request(ctx);
  })
}

export function store(modules) {
  modules.edu_epgu_dictionary = require('./store').default
}

export function routes(routes) {

  Array.prototype.push.apply(routes, [
    {
      parent: 'admin',
      path: '{parent}/edu-epgu/dictionary/term/list',
      component: () => import('./routes/term-list'),
    },
  ]);

}
