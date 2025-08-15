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
          :table-height="scrollHeight+'px'"
          :toolbar-menu="toolbarMenu"
      />

    </template>

  </component>
</template>

<script>

import MVroute from '@tgin/ui/admin/mixin/vroute'

import CTable from "../component/entity/list/tree"

export default {
  mixins: [MVroute],
  components: {
    CTable,

  },
  props: {},
  apollo: {},
  data() {

    return {
      tableMode: 'table',
      page: {
        title: 'Абитуриенты для администратора'
      },
      entities: {
        table: {
          com: () => CTable,
          selectionType: 'multiple',
        },
        recordsetQuery: () => require('../gql/order/query/recordset.gql'),
        filterQuery: () => require('../gql/order/query/filters.gql'),
        filterSchema: [],
        filter: {
          mode: 'admin.' + this.viewId
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
  computed: {
    toolbarMenu() {
      return [
        {
          label: 'АИС',
          children: [
            {
              label: 'Импорт',
              type: 'route',
              path: {name: 'edu.order:ais.import'}
            }
          ]
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
