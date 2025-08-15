import VuePivottable from 'vue-pivottable'
import 'vue-pivottable/dist/vue-pivottable.css'

export function boot({Vue}) {
  Vue.use(VuePivottable)
  Vue.component('ui-pivot', require('./component/pivot').default);
}

export function request(ctx) {

}
