<template>
  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      title="Документы"
      dialogWidth="1150px"
      @hide="onHide"
      :scroll-height.sync="scrollHeight"
      :toolbar="toolbarMenu"
  >
    <template v-slot:default="ctx">

      <ui-data-panel
          :data="orders"
          ref="orders"
          :filters-enable="true"
          :table-height="(scrollHeight-100)+'px'"
      />

    </template>

  </component>
</template>

<script>

import MVroute from '@tgin/ui/admin/mixin/vroute'
import CTable from "../component/rs-table";

export default {
  mixins: [MVroute],
  components: {
    CTable
  },
  props: {

  },
  data() {
    return {
      orders: {
        table: {
          height: 'calc(100vh - 140px)',
          com: CTable
        },
        recordsetQuery: () => require('../gql/query/recordset.gql'),
        //filterQuery: () => require('../gql/query/filters.gql'),
        filterSchema: [],
        filter: {},
        where: {
          MODE: 'seller.' + this.mode,
        },
        rows: [],
        info: {
          total: 0
        },
        nav: {
          sortAscending: false,
          sortField: 'ID',
          limit: 50
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
    mode(val) {
      this.orders.where.MODE = 'seller.' + val
    }
  },
  computed: {
    pageTitle() {
      return 'Курсы'
    },
    toolbarMenu() {
      return [
        {
          label: 'Создать',
          icon: 'add',
          command: {
            type: 'router',
            path: '/admin/school/course/create',
            params: {
              action: 'create'
            },
          }
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
