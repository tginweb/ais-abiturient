<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loaded="requestState.fetched"
      :loading="requestState.fetching"
      :title="pageTitle"
      dialog-width="550px"
      @hide="onHide"
  >
    <template v-slot:default="{entity}">

      <q-form ref="form">

        <div class="flex q-mb-md q-gutter-x-md">
          <div>Текущий статус:</div>
          <div>{{ entity.STATUS_NAME }}</div>
        </div>

        <q-select
            v-model="model.status"
            :options="$store.getters['sale/orderStatusesOrder']"
            :rules="[val => !!val || 'Обязательное поле']"
            emit-value
            label="Новый статус"
            map-options
            option-label="NAME"
            option-value="ID"
            outlined
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
  components: {},
  data() {
    return {
      dialogIs: 'ui-admin-dialog',
      dialog: {
        mode: 'dialog'
      },
      model: {
        status: null,
        notify: true,
        message: '',
      }
    }
  },
  computed: {
    actions() {
      return [
        {
          label: 'Сменить статус',
          callback: this.onSubmit,
          loading: this.requestState.mutating
        }
      ]
    },
    pageTitle() {
      return 'Заказ ' + (this.entity ? this.entity.ACCOUNT_NUMBER + ' / ' + this.entityId : this.entityId)
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async onSubmitCommit() {
      try {
        await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/order/mutation/status.gql'),
          variables: {
            id: this.entity.ID,
            status: this.model.status
          },
          state: this.requestState
        })
        this.onResolve && this.onResolve()
        this.visible = false
      } catch (e) {
        console.log(e)
      }
    },
    async onSubmit() {
      try {
        if (await this.$refs.form.validate())
          await this.onSubmitCommit()
      } catch (e) {
      }
    },
    async fetch() {
      try {
        const entity = await this.$store.dispatch('sale_admin/orderFetch', {
          id: this.entityIdState,
          options: {
            state: this.requestState,
            setFetched: false
          }
        })
        this.assignEntity(entity, this.requestState)
      } catch (e) {
        console.log(e)
      }
    },
  },
  watch: {}
}

</script>

<style lang="scss" scoped>


</style>
