
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
import * as cells from '../cell-ach'


export default {
  components: {
    CDataList
  },
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
        { name: 'id', label: 'ID', field: 'id', sortable: true },
        {
          name: 'createAt',
          label: 'createAt',
          sortable: true,
          field: (row) => '<nobr>' + this.$util.date.timestampToFormat(row.createAt, 'DD MMMM HH:mm') + '</nobr>',
        },
      ],
    }
  },
  computed: {

    toolbarMenu() {
      return [
        {
          title: 'Создать',
          children: [
            {
              label: 'Снапшот',
              type: 'dispatch',
              path: 'edu_ss_competition_list/createSnapshot',
            },
          ]
        },
      ]
    }

  },
  methods: {


  }
}
</script>

<style lang="scss" scoped>


</style>
