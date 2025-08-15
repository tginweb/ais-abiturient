<template>
  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :title="pageTitle"
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
  props: {},
  data() {
    return {
      page: {

      },
      entities: {
        table: {
          com: CTable
        },
        recordsetQuery: () => require('../gql/order/query/recordset.gql'),
        filterQuery: () => require('../gql/order/query/filters.gql'),
        filterSchema: [],
        filter: {
          mode: 'operator.' + this.viewId
        },
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
  methods: {},
  watch: {
    viewId(val) {
      this.entities.nav.page = 1
      this.entities.filter.mode = 'operator.' + val
    }
  },
  computed: {
    views() {
      return [
        {id: 'active', label: 'В работе у оператора'},
        {id: 'archive', label: 'Архив обработанных оператором'},
        {id: 'queue', label: 'Очередь'},
        {id: 'all', label: 'Все'},
      ]
    },
    pageTitle() {
      return 'Заявления для операторов: ' + (this.view ? this.view.label : '')
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
