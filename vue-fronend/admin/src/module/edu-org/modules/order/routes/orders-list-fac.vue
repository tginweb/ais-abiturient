<template>
  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :title="page.title"
      dialog-width="1150px"
      @hide="onHide"
      :scroll-height.sync="scrollHeight"
  >
    <template v-slot:default="ctx">

      <ui-data-panel
          :key="viewId"
          name="orders-list"
          :data.sync="entities"
          ref="orders"
          :filters-enable="true"
          :table-height="scrollHeight+'px'"
          :toolbar-menu="toolbarMenu"
      />

    </template>

  </component>
</template>

<script>

import MVroute from '@tgin/ui/admin/mixin/vroute'
import CTable from "../component/entity/list/list"

export default {
  mixins: [MVroute],
  components: {
    CTable
  },
  props: {
  },
  data() {
    return {
      page: {
        title: 'Заявления для факультетов'
      },
      entities: {
        table: {
          com: CTable
        },
        recordsetQuery: () => require('../gql/order/query/recordset.gql'),
        filterQuery: () => require('../gql/order/query/filters.gql'),
        filterSchema: [],
        filter: {
          mode: 'fac.' + this.viewId
        },
        where: {

        },
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'ID',
          limit: 50,
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
      this.entities.nav.page = 1
      this.entities.filter = {}
      this.entities.filter.mode = 'fac.' + val
    }
  },
  computed: {
    toolbarMenu() {
      return [
        {
          label: 'Добавить абитуриента',
          path: {name: 'edu.order:add'}
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
