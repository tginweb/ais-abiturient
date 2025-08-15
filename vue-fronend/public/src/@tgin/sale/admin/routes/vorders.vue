<template>
  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :title="pageTitle"
      dialogWidth="1150px"
      @hide="onHide"
      :scroll-height.sync="scrollHeight"
  >
    <template v-slot:default="ctx">

      <ui-data-panel
          :data="orders"
          ref="orders"
          :filters-enable="true"
          :table-height="(scrollHeight-50)+'px'"
      />

    </template>

  </component>
</template>

<script>

import CTable from "../component/vorder/list/table";
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
          height: 'calc(100vh - 240px)',
          com: CTable
        },
        recordsetQuery: () => require('../gql/vorder/query/recordset.gql'),
        filterQuery: () => require('../gql/vorder/query/filters.gql'),
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
          limit: 10
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
