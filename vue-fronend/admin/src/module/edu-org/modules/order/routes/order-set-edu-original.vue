<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
      title="Смена статуса подлинника"
      @hide="onHide"
  >
    <template v-slot:default v-if="entity">
      <q-form ref="form">
        <div class="q-mb-md text-weight-bold">
          № {{ entity.nid }} {{ entity.fio }}
        </div>
        <q-checkbox
            v-model="entityState.podldoc"
            class="q-my-md"
            :label="entityState.podldoc ? 'подлинник предоставлен' : 'подлинник не предоставлен'"
            size="xl"
            :color="entityState.podldoc ? 'green' : 'red'"
            keep-color
        />
      </q-form>
    </template>
  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    action: {default: 'edit'}
  },
  components: {
  },
  data() {
    return {
      dialogIs: 'ui-admin-dialog',
      dialog: {
        mode: 'dialog'
      },
      entityIdState: this.entityId
    }
  },
  computed: {
    actions() {
      return [
        {
          label: 'Сменить статус',
          callback: this.onSubmit
        }
      ]
    },
  },
  created() {
    this.fetch()
  },
  methods: {

    onSubmit() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {
            const {result} = await this.$store.dispatch('gql/mutation', {
              mutation: require('../gql/order/mutation/edu_set_original.gql'),
              variables: {
                id: this.entity.id,
                status: this.entityState.podldoc
              }
            })

            if (result.success) {
              this.onResolve && this.onResolve()
              this.visible = false
            }

          } catch (e) {
            console.log(e)
          }

        }

      }).catch((e) => {

      })

    },
    async fetch() {
      const entity = await this.$store.dispatch('edu_order/entityQuerySingle', this.entityId)
      this.assignEntity(entity, this.requestState)
    },

  },
  watch: {

  }

}

</script>

<style lang="scss" scoped>


</style>
