<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loaded="requestState.fetched"
      :loading="requestState.fetching"
      :title="'Автоплатеж ' + entityId"
      dialog-width="1000px"
      @hide="onHide"
  >

    <template v-slot:default="{entity}">

      <div class="row q-col-gutter-lg">

        <div class="col-14 q-gutter-lg">

          <ui-admin-data-card
              title="Общие данные"
              :fields="sectionCommon"
          />

        </div>
        <div class="col-10 q-gutter-lg">


        </div>

      </div>

    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'
import CTablePaycardPayments from "../component/paycard-payment/list/table"

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    action: {default: 'view'}
  },
  components: {
    CTablePaycardPayments
  },
  data() {
    return {
      modeId: 'common',
    }
  },
  computed: {

    sectionCommon() {

      const result = []

      result.push({
        label: 'ID карты',
        value: this.entity.ID,
      })

      result.push({
        label: 'Наименование',
        value: this.entity.TITLE
      })

      if (this.entity.USER) {
        result.push({
          label: 'Пользователь',
          value: this.entity.USER.LOGIN + ' [' + this.entity.USER.ID + ']',
          to: '/admin/user/' + this.entity.USER.ID
        })
      }

      return result
    },

  },
  created() {
    this.fetch()
  },

  methods: {

    async fetch() {
      try {
        const entity = await this.$store.dispatch('sale_admin/paycardPaymentFetch', {
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
  watch: {

  }
}

</script>

<style lang="scss" scoped>


</style>
