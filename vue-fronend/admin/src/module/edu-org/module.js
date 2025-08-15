const modules = [
  require('./modules/doc/module'),
  require('./modules/admission/module'),
  require('./modules/competition/module'),
  require('./modules/achievement/module'),
  require('./modules/campaign/module'),
  require('./modules/decree/module'),
  require('./modules/volume/module'),
  require('./modules/program/module'),
  require('./modules/country/module'),
  require('./modules/doctype/module'),
  require('./modules/family-type/module'),
  require('./modules/fob/module'),
  require('./modules/institute/module'),
  require('./modules/level/module'),
  require('./modules/language/module'),
  require('./modules/precept/module'),
  require('./modules/person-doctype/module'),
  require('./modules/quota-type/module'),
  require('./modules/source/module'),
  require('./modules/subject/module'),
  require('./modules/order/module'),
  require('./modules/app/module'),
  require('./modules/ege/module'),
  require('./modules/abit-test/module'),
  require('./modules/sheet/module'),
  require('./modules/rating/module'),

  require('./modules/ss-entrant/module'),
  require('./modules/ss-app/module'),
  require('./modules/ais-entrant/module'),
  require('./modules/ais-message/module'),

]

export function children() {
  return modules
}

export function boot(ctx) {
  ctx.Vue.component('edu-org-row-expanded', () => import('./component/row-expanded'))
}

export async function request(ctx) {

}

