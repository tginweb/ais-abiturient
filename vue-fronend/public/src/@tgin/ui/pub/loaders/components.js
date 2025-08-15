export function boot({Vue}) {

    Vue.component('ui-pub-accordion', () => import('../component/accordion/accordion'))
    Vue.component('ui-pub-dialog', () => import('../component/dialog/dialog'))

    Vue.component('ui-pager', () => import('../component/pager/pager'))
}

export function request({Vue, router}) {

}
