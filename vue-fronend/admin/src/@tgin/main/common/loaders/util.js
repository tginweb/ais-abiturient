import * as util from '@tgin/main/common/lib/util'

export function boot({Vue, inject}) {
  inject('$util.base', util.base)
  inject('$util.date', util.date)
  inject('$util.html', util.html)
  inject('$util.dom', util.dom)
  inject('$util.validate', util.validate)
  inject('$util.format', util.format)
  inject('$util.vue', util.vue)
}
