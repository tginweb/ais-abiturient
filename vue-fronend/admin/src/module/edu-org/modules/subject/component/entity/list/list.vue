<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
  />

</template>

<script>

import * as cells from '../cell'

import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";

export default {
  mixins: [MTableProxy],
  data() {
    return {
      columns: [
        {
          name: 'id',
          label: 'ID',
          field: 'id',
          sortable: true,
        },
        {
          name: 'name',
          label: 'Имя',
          field: 'name',
          sortable: true,
        },
        {
          name: 'epguId',
          label: 'epguId',
          field: 'epguId',
          sortable: true,
          editable: true,
        },
        {
          name: 'locations',
          label: 'Гафик',
          com: cells.locations,
          sortable: true,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
