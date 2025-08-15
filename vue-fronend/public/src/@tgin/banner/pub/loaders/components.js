export function boot({Vue}) {
    Vue.component('banner-element-card', () => import('../component/entity-card'));
}

export function request({Vue, router}) {

}
