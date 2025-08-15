<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
  />

</template>

<script>

import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";

export default {
  mixins: [MTableProxy],
  props: {
  },
  data() {
    return {
      columns: [
        {
          name: 'id',
          label: 'ID',
          sortable: true,
          field: 'id'
        },
        {
          name: 'name',
          label: 'Имя',
          sortable: true,
          field: 'name'
        },
        {
          name: 'epgu_id',
          label: 'epgu_id',
          sortable: true,
          field: 'epgu_id'
        },
      ],
    }
  },

}
</script>

<style lang="scss" scoped>


</style>
