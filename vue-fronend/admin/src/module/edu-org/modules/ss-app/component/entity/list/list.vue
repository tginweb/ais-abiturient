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
        {name: 'nid', label: 'nid', field: 'uid', sortable: true},
        {name: 'guid', label: 'guid', field: 'guid', sortable: true},
        {name: 'guidEntrant', label: 'guidEntrant', field: 'guidEntrant', sortable: true},
        {name: 'entrantId', label: 'entrantId', field: 'entrantId', sortable: true},
        {name: 'fio', label: 'fio', field: 'fio', sortable: true},
        {name: 'snils', label: 'snils', field: 'snils', sortable: true},

        {name: 'isBudget', label: 'isBudget', field: 'isBudget', sortable: true},
        {name: 'registrationDate', label: 'registrationDate', field: 'registrationDate', sortable: true},
        {name: 'apps', label: 'apps', com: cells.apps, sortable: true},
      ]
    }
  },
  computed: {


  },
  methods: {}
}
</script>

<style lang="scss" scoped>


</style>
