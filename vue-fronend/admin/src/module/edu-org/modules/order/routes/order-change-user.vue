<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
      title="Смена пользователя"
      @hide="onHide"
  >
    <template v-slot:default v-if="entity">
      <q-form ref="form">
        <div class="q-mb-md text-weight-bold">
          Абитуриент № {{ entity.nid }} {{ entity.fio }}
        </div>
        <div class="q-mb-md text-weight-bold">
          UserID № {{ entity.userId }}
        </div>
        {{userId}}
        <ui-autocomplete
          :query="() => require('../gql/order/query/users_options.gql')"
          option-label="label"
          option-value="id"
          outlined
          :mapOptions="true"
          :emitValue="true"
          v-model="userId"
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
      userId: null,
      entityIdState: this.entityId
    }
  },
  computed: {
    actions() {
      return [
        {
          label: 'Сменить пользователя',
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
              mutation: require('../gql/order/mutation/changeUser.gql'),
              variables: {
                id: this.entity.id,
                userId: this.userId
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
      this.userId = entity.userId
    },

  },
  watch: {

  }

}

</script>

<style lang="scss" scoped>


</style>
