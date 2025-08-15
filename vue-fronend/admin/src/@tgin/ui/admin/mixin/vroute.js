import MVroute from '@tgin/main/router/mixin/vroute'

export default {
    mixins: [MVroute],
    props: {
        defaultDialogIs: {default: 'ui-admin-dialog'},
        defaultPageIs: {default: 'ui-admin-page'},
    },
}
