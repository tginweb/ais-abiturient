<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :title="title"
      dialog-width="1150px"
      @hide="onHide"
      :scroll-height.sync="scrollHeight"
  >
    <template v-slot:default="ctx">

      <ui-data-panel
          :key="viewId"
          :data.sync="entities"
          ref="orders"
          :filters-enable="true"
          :table-height="(scrollHeight-0)+'px'"
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
      },
      entities: {
        table: {
          height: 'calc(100vh - 140px)',
          com: CTable,
          clientSideNav: false
        },
        recordsetQuery: () => require('../gql/query/list.gql'),
        filterQuery: () => require('../gql/query/filters.gql'),
        filterSchema: [],
        filter: {
          mode: 'fac.' + this.viewId
        },
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
  computed: {
    title() {
      return this.viewId === 'own' ? 'Конкурсы по факультету' : 'Все конкурсы'
    }
  },
  watch: {
    viewId(val) {
      this.entities.nav.page = 1
      this.entities.filter.mode = 'fac.' + val
    }
  },
}
</script>
<style lang="scss" scoped>


</style>
