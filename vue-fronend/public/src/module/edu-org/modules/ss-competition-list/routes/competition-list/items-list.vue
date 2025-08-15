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
          :data.sync="entities"
          ref="orders"
          :table-height="(scrollHeight-50)+'px'"
      />
    </template>
  </component>
</template>

<script>

import MVroute from '@tgin/ui/admin/mixin/vroute'
import CTable from "../../component/snap/list/list"

export default {
  mixins: [MVroute],
  components: {
  },
  apollo: {},
  data() {
    return {
      page: {
        title: 'Списки'
      },
      entities: {
        table: {
          com: CTable
        },
        recordsetQuery: () => require('../../gql/list/query/listRecordset.gql'),
        filterQuery: () => require('../../gql/list/query/filters.gql'),
        filterSchema: [],
        filter: {},
        where: {},
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'id',
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
  methods: {

  }
}
</script>
<style lang="scss" scoped>


</style>
