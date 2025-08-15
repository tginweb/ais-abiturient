export function boot({Vue}) {

    Vue.component('ui-accordion', () => import('../component/accordion/accordion'))
    Vue.component('ui-alerts', () => import('../component/alerts/alerts'))
    Vue.component('ui-autocomplete', () => import('../component/autocomplete/autocomplete'))

    Vue.component('ui-data-filters', () => import('../component/data-filters/data-filters'))
    Vue.component('ui-data-panel', () => import('../component/data-panel/data-panel'))
    Vue.component('ui-data-table', () => import('../component/data-table/data-table'))
    Vue.component('ui-data-source', () => import('../component/data-source/data-source'))

    Vue.component('ui-file-uploader', () => import('../component/file-uploader/file-uploader'))

    Vue.component('ui-input-address', () => import('../component/input-address/input-address'))
    Vue.component('ui-input-inn', () => import('../component/input-inn/input-inn'))
    Vue.component('ui-input-snils', () => import('../component/input-snils/input-snils'))
    Vue.component('ui-input-select', () => import('../component/input-select'))

    Vue.component('ui-carousel', () => import('../component/carousel/carousel'))

    Vue.component('ui-items', () => import('../component/items/items'))
    Vue.component('ui-items-grid', () => import('../component/items/items-grid'))
    Vue.component('ui-items-regional', () => import('../component/items/items-regional'))

    Vue.component('ui-menu', () => import('../component/menu/menu'))
    Vue.component('ui-menu-vertical', () => import('../component/menu/menu-vertical'))
    Vue.component('ui-menu-dialog', () => import('../component/menu/menu-dialog'))

    Vue.component('ui-menu-toolbar', () => import('../component/menu/menu-toolbar'))

    Vue.component('ui-menu-drawer', () => import('../component/menu/menu-drawer'))
    Vue.component('ui-menu-route-tabs', () => import('../component/menu/menu-route-tabs'))
    Vue.component('ui-menu-drawer', () => import('../component/menu/menu-drawer'))

    Vue.component('ui-notify-dispatcher', () => import('../component/notify-dispatcher/notify-dispatcher'))

    Vue.component('ui-avatar', () => import('../component/avatar/avatar'))

    Vue.component('ui-query', () => import('../component/query/view/view-query'))

    Vue.component('ui-router-page', () => import('../component/router/router-page'))

    Vue.component('ui-dialog', () => import('../component/dialog/dialog'))
    Vue.component('ui-input-date', () => import('../component/input-date/input-date'))
    Vue.component('ui-input-phone', () => import('../component/input-phone/input-phone'))
    Vue.component('ui-input-email', () => import('../component/input-email/input-email'))

    Vue.component('ui-progress-inner-loading', () => import('../component/progress/progress-inner-loading'))
    Vue.component('ui-progress-skeleton', () => import('../component/progress/progress-skeleton'))
    Vue.component('ui-progress-skeleton-wrapper', () => import('../component/progress/progress-skeleton-wrapper'))
    Vue.component('ui-progress-spinner', () => import('../component/progress/progress-spinner'))

    Vue.component('ui-accordion', () => import('../component/accordion/accordion'))

    Vue.component('ui-data-card', () => import('../component/data-card/data-card'))
    Vue.component('ui-data-fields', () => import('../component/data-fields/data-fields'))

    Vue.component('ui-datetime-view', () => import('../component/datetime-view/datetime-view'))

    Vue.component('ui-data-tree-view', () => import('../component/data-tree-view/data-tree-view'))
}

export function request({Vue, router}) {

}
