<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @update:filterExpanded="$emit('update:filterExpanded', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
      selection-type="multiple"
  />

</template>

<script>
import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";

export default {
  mixins: [MTableProxy],
  props: {
    query: {},
    filtersQuery: {},
  },
  data() {
    return {

      columns: [
        {
          name: 'taxonomy',
          label: 'Словарь',
          sortable: true,
          field: 'taxonomyLabel'
        },
        {
          name: 'id',
          label: 'ID',
          sortable: true,
          field: 'id'
        },
        {
          name: 'name',
          label: 'Наименование',
          sortable: true,
          field: 'name'
        },
        {
          name: 'actual',
          label: 'Актуально',
          sortable: true,
          field: 'actual'
        },
        {
          name: 'fields',
          label: 'Свойства',
          sortable: true,
          field: 'fields'
        },
        {
          name: 'aisId',
          label: 'АИС ID',
          editable: true,
          sortable: true,
          field: 'aisId'
        },
      ],
    }
  },
  computed: {

  },
}
</script>

<style lang="scss" scoped>


</style>
