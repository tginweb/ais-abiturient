import randId from "@tgin/main/common/lib/util/base/randID";


export default {
    props: {
        viewId: {},

        vrouterType: {default: 'native'},
        vrouterIndex: {},
        vrouterUid: {},

        onEntityEvent: {},
        onEvent: {},

        entityType: {default: ''},
        entityId: {default: ''},

        entityHash: {},
        entityData: {},

        onResolve: {},

        action: {default: 'default'},

        defaultDialogIs: {default: 'ui-dialog'},
        defaultPageIs: {default: 'tpl-page-view-common'},

    },
    data() {
        return {
            dialogModule: '',
            dialogName: '',

            fetching: false,
            fetched: false,

            requestMutate: {
                proc: false
            },

            state: {},
            updateStoreState: false,

            dialogIs: null,
            dialog: {},
            pageIs: null,

            visible: true,

            entity: this.entityData,
            // entityType: null,
            entityIdState: this.entityId ? parseInt(this.entityId) : null,
            entityIdTemp: randId(),

            entityState: null,
            actionState: this.action,

            changed: false,

            modeId: null,
            submodeId: null,

            modesUsed: {},

            viewIdState: this.viewId,
            viewsUsed: {},

            scrollHeight: 0,

            requestState: {
                process: false,
                mutating: false,
                mutated: false,
                fetching: false,
                fetched: false,
                rateLimit: 0
            },
        }
    },
    created() {

        if (this.modeId) {
            this.modesUsed[this.modeId] = true
        }

        if (this.submodeId) {
            this.modesUsed[this.modeId + '.' + this.submodeId] = true
        }

        if (this.entityType) {
            this.$bus.on('entity.updated.' + this.entityType, this.onEntityExternalUpdated);

            if (this.entityIdState)
                this.$bus.on('entity.updated.' + this.entityType + '.' + this.entityIdState, this.onEntityExternalUpdated);
        }
    },
    watch: {
        modeId(v) {
            this.modesUsed[v] = true
            if (this.mode) {
                if (this.mode.defaultSubmode) {
                    this.submodeId = this.mode.defaultSubmode
                }
            }
        },
        submodeId(v) {
            this.modesUsed[this.modeId + '.' + this.submodeId] = true
        },

        viewId(v) {
            this.viewIdState = v
        },

        entityIdState(id, oldId) {
            if (this.entityType && !oldId && id)
                this.$bus.on('entity.updated.' + this.entityType + '.' + this.entityIdState, this.onEntityExternalUpdated);
        }
    },
    beforeDestroy() {
        if (this.entityType) {
            this.$bus.off('entity.updated.' + this.entityType, this.onEntityExternalUpdated);

            if (this.entityIdState)
                this.$bus.off('entity.updated.' + this.entityType + '.' + this.entityIdState, this.onEntityExternalUpdated);
        }
    },
    computed: {

        isDialog() {
            return this.vrouterType !== 'native'
        },

        isPage() {
            return this.vrouterType === 'native'
        },

        bindRouterWrapper() {

            if (!this.$store)
                return {}

            const res = {}

            switch (this.vrouterType) {

                case 'dialog':
                    const currIndex = this.$store.getters['router/vrouterIndex']

                    const vroute = this.$store.state.router.vroutes[this.vrouterIndex]

                    res.dialogUid = this.vrouterUid

                    res.orderRoot = this.vrouterIndex === 0
                    res.orderIndex = this.vrouterIndex
                    res.orderCurrent = this.vrouterIndex === currIndex
                    res.order = vroute.order
                    res.url = vroute.url

                    res.disabled = !res.orderCurrent

                    res.is = this.dialogIs || this.defaultDialogIs

                    if (this.dialog)
                        for (const [key, value] of Object.entries(this.dialog)) {
                            res['dialog-' + key] = value
                        }

                    res.value = this.visible

                    break;

                default:

                    let pageIs

                    if (this.pageIs) {
                        pageIs = this.pageIs
                    } else if (this.pageViewBind && this.pageViewBind.is) {
                        pageIs = this.pageViewBind.is
                    } else {
                        pageIs = this.defaultPageIs
                    }

                    res.is = pageIs
                    res.class = this.pageClass
            }

            res.actions = this.actions || []

            return res
        },

        mode() {
            return this.modesById[this.modeId]
        },

        modesTabs() {
            return this.modes.filter(item => item.type === 'tab')
        },

        modesById() {
            return this.modes.reduce((map, obj) => (map[obj.id] = obj, map), {})
        },

        modes() {
            return []
        },

        views() {
            return []
        },

        viewsById() {
            return this.views.reduce((map, obj) => (map[obj.id] = obj, map), {})
        },

        view() {
            return this.viewsById[this.viewIdState]
        },
    },
    methods: {

        async mutationMethod(cb) {
            this.requestMutate.proc = true

            try {
                await cb()
            } catch (e) {
                throw e
            }

            this.requestMutate.proc = false
        },

        async fetchingMethod(cb) {
            this.fetching = true

            try {
                await cb()
            } catch (e) {
                this.fetching = false
                throw e
            }

            this.fetching = false
            this.fetched = true
        },

        onEntityExternalUpdated() {


        },

        assignEntity(entity, state = {}) {

            this.entity = entity
            this.entityState = this.entityForEdit(entity)

            this.$nextTick(() => {
                state.fetching = false
                state.fetched = true
                state.assigned = true
            })
        },

        entityForEdit(entity) {
            return {
                ...entity
            }
        },

        entityForSave(entity) {
            return {
                ...entity
            }
        },
        onShake() {

        },
        onBeforeHide() {

        },
        onHide() {
            this.$store.dispatch('router/vrouterBeforeClose')
            this.visible = false
            this.$nextTick(() => {
                this.$store.dispatch('router/vrouterClose')
            })
        },

    }
}
