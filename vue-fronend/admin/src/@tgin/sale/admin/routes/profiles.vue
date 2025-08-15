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
          :toolbar-menu="toolbarMenu"
          :table-height="(scrollHeight-50)+'px'"
      />

    </template>

  </component>
</template>

<script>

import CTable from "../component/profile/list/table";
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
        recordsetQuery: () => require('../gql/profile/query/recordset.gql'),
        filterQuery: () => require('../gql/profile/query/filters.gql'),
        filterSchema: [],
        filter: {},
        where: {
        },
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'ID',
          limit: 30
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

  },
  computed: {
    pageTitle() {
      return 'Профили'
    },
    toolbarMenu() {
      return []
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
