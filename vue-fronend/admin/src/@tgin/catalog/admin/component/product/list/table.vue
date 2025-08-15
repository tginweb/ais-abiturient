<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
  >
    <template v-slot:right v-if="$slots.right">
      <slot name="right"/>
    </template>
  </ui-data-table>

</template>

<script>

import MTableProxy from '@tgin/ui/core/component/data-table/mixin/table-proxy'

export default {
  components: {},
  mixins: [MTableProxy],
  props: {
    columnsHidden: {default: () => []},
  },
  data() {
    return {
      filtersDefaults: {},

      columns: [
        {
          name: 'ID',
          label: 'ID',
          sortable: true,
          field: 'ID'
        },
        {
          name: 'NAME',
          label: 'NAME',
          sortable: true,
          field: 'NAME'
        },
        {
          name: 'ACTIVE',
          label: 'ACTIVE',
          sortable: true,
          field: 'ACTIVE',
          type: 'boolean'
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
