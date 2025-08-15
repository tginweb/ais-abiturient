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
          :table-height="(scrollHeight-0)+'px'"
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
  apollo: {},
  data() {
    return {
      page: {
        title: 'Очередь сообщений ФИС'
      },
      entities: {
        table: {
          com: CTable
        },
        recordsetQuery: () => require('../gql/query/listRecordset.gql'),
        filterQuery: () => require('../gql/query/listFilters.gql'),
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
          sortField: 'idJwt',
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
          label: 'Операции',
          children: [
            {
              label: 'Импорт новых',
              type: 'dispatch',
              path: 'edu_fis_message/apiMutate',
              args: {
                mutation: 'importQueue',
              },
            },
          ]

        },
      ]
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
