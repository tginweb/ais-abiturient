<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
      idField="_id"
  />

</template>

<script>

import MTableProxy from '@tgin/ui/core/component/data-table/mixin/table-proxy'

export default {
  components: {},
  mixins: [MTableProxy],
  props: {
    columnsHidden: {},
  },
  data() {
    return {
      columns: [
        {
          name: 'nid',
          label: 'nid',
          sortable: true,
          field: 'nid',
        },
        {
          name: 'name',
          label: 'name',
          sortable: true,
          field: 'name',
        },
      ],
    }
  },

}
</script>

<style lang="scss" scoped>


</style>
