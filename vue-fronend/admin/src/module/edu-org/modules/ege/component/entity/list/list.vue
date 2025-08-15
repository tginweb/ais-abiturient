<template>

  <ui-data-table
      v-bind="bind"
      @filterChange="$emit('filterChange', $event)"
      @update:nav="$emit('update:nav', $event)"
  />

</template>

<script>

import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";

export default {
  mixins: [MTableProxy],
  props: {},
  data() {
    return {
      columns: [
        {
          name: 'passportSer',
          label: 'passportSer',
          field: 'passportSer',
          sortable: true,
        },
        {
          name: 'passportNum',
          label: 'passportNum',
          field: 'passportNum',
          sortable: true,
        },
        {
          name: 'firstName',
          label: 'firstName',
          field: 'firstName',
          sortable: true,
        },
        {
          name: 'lastName',
          label: 'lastName',
          field: 'lastName',
          sortable: true,
        },
        {
          name: 'secondName',
          label: 'secondName',
          field: 'secondName',
          sortable: true,
        },
        {
          name: 'mark',
          label: 'mark',
          field: 'mark',
          sortable: true,
        },
        {
          name: 'year',
          label: 'year',
          field: 'year',
          sortable: true,
        },
        {
          name: 'dateStr',
          label: 'dateStr',
          field: 'dateStr',
          sortable: true,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
