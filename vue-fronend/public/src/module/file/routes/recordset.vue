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
  apollo: {},
  data() {
    return {
      page: {
        title: 'Файлы'
      },
      entities: {
        table: {
          com: CTable
        },
        recordsetQuery: () => require('../gql/query/recordset.gql'),
        filterQuery: () => require('../gql/query/filters.gql'),
        filterSchema: [],
        filter: {
        },
        where: {
        },
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'nid',
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
      return [
        {
          label: 'Создать пакет',
          path: {name: 'edu.epgu.message:create'}
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
