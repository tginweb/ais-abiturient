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
  props: {
    idField: {default: 'nid'},
    nidField: {default: 'nid'},
  },
  data() {
    return {
      columns: [
        {
          name: 'nid',
          label: 'ID заявления',
          field: 'nid',
          sortable: true,
          sticky: true
        },
        {
          name: 'orderNid',
          label: 'Абитуриент',
          com: cells.person,
          sortable: true,
        },
        {
          name: 'eduProgramNid',
          label: 'Направление',
          field: 'admission.name',
          sortable: true,
        },
        {
          name: 'csource',
          label: 'Конкурс',
          field: 'source.nameShort',
          sortable: true,
        },
        {
          name: 'statusCode',
          label: 'Код статуса',
          field: 'statusCode',
          sortable: true,
        },
        {
          name: 'statusTitle',
          label: 'Статус',
          field: 'statusTitle',
          sortable: true,
        },
        {
          name: 'epgu',
          label: 'ЕПГУ',
          com: cells.epgu,
          sortable: true,
        },
        {
          name: 'ais',
          label: 'АИС',
          com: cells.ais,
          sortable: true,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
