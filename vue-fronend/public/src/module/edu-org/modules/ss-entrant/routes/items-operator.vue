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
          title: 'Создать',
          type: 'router',
          path: '/admin/edu-epgu/order/import-applications'
        },
      ]
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
