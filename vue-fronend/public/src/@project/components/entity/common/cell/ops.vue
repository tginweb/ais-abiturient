<template>

    <q-btn
            :dense="dense"
            :flat="flat"
            :icon="icon"
            :label="label"
            :outlined="outlined"
            :size="size"
            :color="color"
            @click.stop
    >

        <q-menu content-class="c-ops-menu" auto-close ref="menu" style="">

            <q-list separator>

                <q-item
                        :key="action.id"
                        @click="onAction(action)"
                        clickable
                        v-for="action in actions"
                >
                    <q-item-section avatar class="q-pr-md" style="min-width: auto;">
                        <q-icon color="primary" :name="action.icon" />
                    </q-item-section>
                    <q-item-section>

                        {{action.label}}
                    </q-item-section>
                </q-item>

            </q-list>

        </q-menu>

    </q-btn>

</template>

<script>
    export default {
        props: {
            dense: {},
            label: {},
            size: {},
            icon: {},
            row: {},
            outlined: {},
            flat: {},
            emitter: {},
            color: {},

            entityModule: {},
            entityType: {},

        },

        methods: {
            onAction(action) {
                if (action.dispatchDialog) {
                    this.$store.dispatch(
                        'dialogShow',
                        [
                            action.dispatchDialog,
                            {
                                row: this.row,
                                emitter: (event, eventData) => {
                                    if (event==='submitted' || event=='actionSubmitted') {
                                        this.$emit('actionSubmitted', eventData)
                                    } else {
                                        this.$emit(event, eventData)
                                    }
                                }
                            }
                        ]
                    )
                }
            }
        },

        computed: {

            actions() {
                let result = [], actions;

                let userRowPerms = this.row.userAccess && Object.keys(this.row.userAccess).filter(perm => this.row.userAccess[perm]) || []

                if (this.entityModule) {

                    if (this.$store.state[this.entityModule].entity[this.entityType]) {

                        let actions = this.$store.state[this.entityModule].entity[this.entityType].actions

                        result = Object.keys(actions).filter((actionId) => {

                            if (actions[actionId].cond && !actions[actionId].cond(this.row)) return false

                            return !!actions[actionId].perms.find(actionPerm => {
                                return userRowPerms.indexOf(actionPerm) > -1
                            })
                        }).map(actionId => ({
                            id: actionId,
                            ...actions[actionId]
                        }))
                    }


                }

                return result
            }
        }
    }
</script>

<style lang="scss">

    .c-ops-menu {
        max-width: 300px !important;
    }


</style>
