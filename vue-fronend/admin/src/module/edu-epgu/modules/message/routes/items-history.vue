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
          :filters-enable="true"
          :table-height="(scrollHeight-50)+'px'"
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
  apollo: {},
  data() {
    return {
      page: {
        title: 'История сообщений'
      },
      entities: {
        table: {
          com: CTable
        },
        recordsetQuery: () => require('../gql/query/listRecordset.gql'),
        filterQuery: () => require('../gql/query/listFilters.gql'),
        filterSchema: [],
        filter: {
        },
        where: {
          archive: true
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
}
</script>
<style lang="scss" scoped>


</style>
