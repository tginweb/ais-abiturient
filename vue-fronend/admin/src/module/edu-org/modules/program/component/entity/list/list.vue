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
          field: 'id',
          sortable: true,
        },
        {
          name: 'uid',
          label: 'UID',
          field: 'uid',
          sortable: true,
        },
        {
          name: 'name',
          label: 'Имя',
          field: 'name',
          sortable: true,
        },
        {
          name: 'cadmission',
          label: 'cadmission',
          field: 'cadmission',
          sortable: true,
        },
        {
          name: 'cdirection',
          label: 'Направление',
          field: (row) => row.direction ? row.direction.name + ' [' + row.direction.id + ']' : '',
          sortable: true,
        },
        {
          name: 'okso',
          label: 'ОКСО',
          field: 'direction.cod',
        },
        {
          name: 'cfob',
          label: 'Форма',
          field: 'fob.name',
          sortable: true,
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
