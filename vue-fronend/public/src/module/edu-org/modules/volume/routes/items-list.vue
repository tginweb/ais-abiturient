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
      />

    </template>

  </component>
</template>

<script>

import MVroute from '@tgin/ui/admin/mixin/vroute'
import CTable from "../component/entity/list/list";

export default {
  mixins: [MVroute],
  components: {
    CTable
  },
  data() {
    return {
      page: {
        title: 'Объемы приема'
      },
      entities: {
        table: {
          height: 'calc(100vh - 100px)',
          com: CTable
        },
        recordsetQuery: () => require('../gql/query/recordset.gql'),
        filterQuery: () => require('../gql/query/filters.gql'),
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
