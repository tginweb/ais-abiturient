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
  components: {

  },
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
          name: 'uid',
          label: 'UID',
          sortable: true,
          field: 'uid'
        },
        {
          name: 'name',
          label: 'Имя',
          sortable: true,
          field: 'name'
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
