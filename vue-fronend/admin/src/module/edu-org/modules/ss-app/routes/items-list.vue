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
  components: {
  },
  apollo: {},
  data() {
    return {
      page: {
        title: 'Абитуриенты на ЕПГУ'
      },
      entities: {
        table: {
          com: CTable
        },
        recordsetQuery: () => require('../gql/query/listRecordset.gql'),
        filterQuery: () => require('../gql/query/filters.gql'),
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

  },
  computed: {
    toolbarMenu() {
      return [
        {
          label: 'Операции',
          children: [
            {
              label: 'Импорт с ЕПГУ',
              type: 'dispatch',
              path: 'edu_epgu_message/apiMutate',
              args: {
                mutation: 'createFromArgs',
                messageType: 'ApplicationListAll',
              },
            },
            {
              label: 'Проставить статус всем',
              type: 'dispatch',
              path: 'edu_epgu_message/apiMutate',
              args: {
                mutation: 'createFromArgs',
                messageType: 'CompetitiveGroupStatusList',
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
