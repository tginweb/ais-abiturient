<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
      selection-type="multiple"
  />

</template>

<script>

import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";
import * as cells from '../cell'

export default {
  mixins: [MTableProxy],
  props: {
    query: {},
    filtersQuery: {},
    filtersNames: {default: () => ([])}
  },
  data() {
    return {
      filterDefaults: {},
      columns: [
        {name: '_id', label: '_id', field: '_id', sortable: true},

        {name: 'id', label: 'ID', field: 'id', sortable: true},

        {name: 'fio', label: 'ФИО', com: cells.person, sortable: true},

        {name: 'epgu.state', label: 'epgu.state', com: cells.epguState, sortable: true},

        {name: 'apps', label: 'apps', com: cells.appsAis, sortable: true},

        {name: 'subjects', label: 'subjects', com: cells.subjects, sortable: true},


        //{name: 'snils', label: 'СНИЛС', field: 'snils', sortable: true},
        //{ name: 'data.KLADR_CODE', label: 'data.KLADR_CODE', field: 'data.KLADR_CODE', sortable: true },

        {name: 'data.ccontry', label: 'ccontry', com: cells.citizenship, sortable: true},


        {name: 'cells.aisData', label: 'cells.aisData', com: cells.aisData, sortable: true},

        {name: 'fob', label: 'Форма', com: cells.fob, sortable: true},
        {name: 'source', label: 'Основа', com: cells.source, sortable: true},

        {name: 'edu', label: 'edu', com: cells.edu, sortable: true},

        {name: 'state', label: 'state', field: 'state', sortable: true},
      ]
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>


</style>
