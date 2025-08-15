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
          :data="list"
          ref="orders"
          :filters-enable="true"
          :toolbar-menu="toolbarMenu"
          :table-height="(scrollHeight-50)+'px'"
      />

    </template>

  </component>
</template>

<script>

import CTable from "../component/product/list/table";
import MVroute from '@tgin/ui/admin/mixin/vroute'

export default {
  mixins: [MVroute],
  components: {
    CTable
  },
  props: {
    iblock: {}
  },
  data() {
    return {
      list: {
        table: {
          height: 'calc(100vh - 140px)',
          com: CTable
        },
        recordsetQuery: () => require('../gql/product/query/recordset.gql'),
        filterQuery: () => require('../gql/product/query/filters.gql'),
        filterSchema: [],
        variables: {
          iblock: parseInt(this.iblock)
        },
        filter: {
        },
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
          limit: 50
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

    }
  },
  computed: {
    views() {
      return [
        {id: 'active', label: 'Активные'},
        {id: 'noactive', label: 'Не активные'},
        {id: 'all', label: 'Все'},
      ]
    },
    pageTitle() {
      return 'Товары: ' + (this.view ? this.view.label : '')
    },
    toolbarMenu() {
      return []
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
