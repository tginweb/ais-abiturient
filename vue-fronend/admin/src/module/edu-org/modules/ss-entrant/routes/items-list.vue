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
          :table-height="(scrollHeight)+'px'"
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
    CTable
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

  },
  computed: {
    toolbarMenu() {
      return [
        {
          label: 'Импорт с ЕПГУ',
          type: 'dispatch',
          path: 'edu_epgu_message/apiMutate',
          args: {
            mutation: 'createFromArgs',
            messageType: 'EntrantListGetAll',
          },
        },
      ]
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
