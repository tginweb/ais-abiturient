<template>
  <component
      v-model="visible"
      :scroll-height.sync="scrollHeight"
      :title="page.title"
      dialog-width="1150px"
      v-bind="bindRouterWrapper"
      @hide="onHide"

  >

    <template v-slot:default="ctx">
      <ui-data-panel
          ref="orders"
          :data.sync="entities"
          :filters-enable="true"
          :table-height="scrollHeight+'px'"
          :toolbar-menu="toolbarMenu"
          name="orders-list"
      />

    </template>

  </component>
</template>

<script>

import MVroute from '@tgin/ui/admin/mixin/vroute'

import CTable from "../component/entity/list/list"
import CTableMoodle from "../component/entity/list/list-moodle"

export default {
  mixins: [MVroute],
  components: {
    CTable,
    CTableMoodle,
  },
  props: {},
  apollo: {},
  data() {

    return {
      tableMode: 'table',
      page: {
        title: 'Выгрузка ВИ для Moodle'
      },
      entities: {
        table: {
          com: () => CTableMoodle,
          clientSideNav: true
        },
        query: () => require('../gql/order/query/moodle_recordset.gql'),
        filterQuery: () => require('../gql/order/query/moodle_filters.gql'),
        filterSchema: [],
        filter: {
          mode: 'admin.' + this.viewId
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
  computed: {
    toolbarMenu() {
      return []
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
