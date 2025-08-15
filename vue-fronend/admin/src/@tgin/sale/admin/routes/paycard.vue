<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loaded="requestState.fetched"
      :loading="requestState.fetching"
      :title="'Платежная карта ' + entityId"
      :tabs="modesTabs"
      :tab.sync="modeId"
      dialog-width="1000px"
      @hide="onHide"
  >

    <template v-slot:default="{entity}">

      <ui-data-source
          :data.sync="payments"
          ref="dsPayments"
          v-if="modesUsed['payments']"
      />

      <q-tab-panels v-model="modeId" animated>

        <q-tab-panel class="q-px-none" name="common">

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

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="payments">

          <c-table-paycard-payments
              class="q-pa-xs"
              ref="payments"
              :info="payments.info"
              :rows="payments.rows"
              :nav.sync="payments.nav"
              :status="payments.status"
              :columns-hidden="['USER_ID']"
              :pagination-enable="false"
          />

        </q-tab-panel>

      </q-tab-panels>


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
      payments: {
        recordsetQuery: () => require('../gql/paycard-payment/query/recordset.gql'),
        filterSchema: [],
        filter: {

        },
        where: {},
        rows: [],
        info: {
          total: 0
        },
        nav: {
        },
        status: {
          loaded: false,
          loading: false,
        },
      },
    }
  },
  computed: {

    modes() {
      if (!this.entity)
        return []

      return [
        {
          id: 'common',
          label: 'Общее',
          type: 'tab',
        },
        {
          id: 'payments',
          label: 'Платежи',
          type: 'tab',
        },
      ]
    },

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
        const entity = await this.$store.dispatch('sale_admin/paycardFetch', {
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
    'entity.ID'(id) {
      this.payments.filter.PAYCARD_ID = {eq: id}
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
