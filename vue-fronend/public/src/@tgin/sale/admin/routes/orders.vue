<template>
  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :title="pageTitle"
      dialog-width="1150px"
      @hide="onHide"
      :scroll-height.sync="scrollHeight"
  >
    <template v-slot:default="ctx">


      <ui-data-panel
          :filterWidth="17"
          :data.sync="orders"
          ref="orders"
          :filters-enable="true"
          :toolbar-menu="toolbarMenu"
          :table-height="(scrollHeight-50)+'px'"
      />

    </template>

  </component>
</template>

<script>

import CTable from "../component/order/list/table";
import MVroute from '@tgin/ui/admin/mixin/vroute'

export default {
  mixins: [MVroute],
  components: {
    CTable
  },
  props: {},
  data() {
    return {
      orders: {
        table: {
          height: 'calc(100vh - 140px)',
          com: CTable
        },
        recordsetQuery: () => require('../gql/order/query/recordset.gql'),
        filterQuery: () => require('../gql/order/query/filters.gql'),
        filterSchema: [],
        filter: {},
        where: {
          MODE: this.viewId,
        },
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'ID',
          limit: 10,
          page: 1
        },
        status: {
          loaded: false,
          loading: false,
        },
      },
    }
  },
  methods: {},
  watch: {
    viewId(val) {
      this.orders.filter = {}
      this.orders.nav.page = 1
      this.orders.where.MODE = val
    }
  },
  computed: {
    views() {
      return [
        {id: 'active', label: 'Активные'},
        {id: 'completed', label: 'Завершенные'},
        {id: 'canceled', label: 'Отмененные'},
        {id: 'all', label: 'Все'},
      ]
    },
    pageTitle() {
      return 'Заказы: ' + (this.view ? this.view.label : '')
    },
    toolbarMenu() {
      return []
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
