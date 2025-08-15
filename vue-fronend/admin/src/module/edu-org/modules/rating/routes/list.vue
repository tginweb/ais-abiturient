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
          :filters-enable="false"
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
    CTable
  },
  data() {
    return {
      page: {
        title: 'Конкурсные списки'
      },
      entities: {
        table: {
          height: 'calc(100vh - 140px)',
          com: CTable
        },
        recordsetQuery: () => require('../gql/query/recordset.gql'),
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
          label: 'Добавить список',
          type: 'dispatch',
          confirm: 'Создать конкурсный список?',
          path: 'edu_rating/create',
        },
      ]
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
