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
          :table-height="scrollHeight+'px'"
      />

    </template>

  </component>
</template>

<script>

import CTable from "../component/event/list/table";
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
          com: CTable
        },
        recordsetQuery: () => require('../gql/tag/query/recordset.gql'),
        filterQuery: () => require('../gql/tag/query/filters.gql'),
        filterSchema: [],
        filter: {},
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'created',
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

  },
  computed: {
    pageTitle() {
      return 'Тэги'
    },
    toolbarMenu() {
      return [
        {
          label: 'Добавить',
          path: {name: 'tagger:tag.create'}
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
