import JsonViewer from 'vue-json-viewer'

export function boot({Vue}) {
    Vue.use(JsonViewer)

    Vue.component('ui-admin-page-header', () => import('../component/page-header/page-header'))
    Vue.component('ui-admin-page', () => import('../component/page/page'))

    Vue.component('ui-admin-dialog', () => import('../component/dialog/dialog'))

    Vue.component('ui-admin-progress-inner-loading', () => import('../component/progress/progress-inner-loading'))
    Vue.component('ui-admin-progress-skeleton', () => import('../component/progress/progress-skeleton'))
    Vue.component('ui-admin-progress-skeleton-wrapper', () => import('../component/progress/progress-skeleton-wrapper'))
    Vue.component('ui-admin-progress-spinner', () => import('../component/progress/progress-spinner'))

    Vue.component('ui-admin-data-card', () => import('../component/data-card/data-card'))
    Vue.component('ui-admin-data-fields', () => import('../component/data-fields/data-fields'))

    Vue.component('ui-btn-add', () => import('../component/btn/btn-add'))

    Vue.component('ui-admin-file-uploader', () => import('../component/file-uploader/file-uploader'))
}

export function request({Vue, router}) {

}
