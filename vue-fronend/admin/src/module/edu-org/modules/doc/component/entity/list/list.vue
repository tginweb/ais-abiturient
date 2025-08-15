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
          name: 'nid',
          label: 'ID',
          field: 'nid',
          sortable: true,
        },
        {
          name: 'order.fio',
          label: 'Источник',
          field: 'order.fio',
          sortable: true,
        },
        {
          name: 'typeName',
          label: 'Роль документа',
          field: 'typeName',
          sortable: true,
        },
        {
          name: 'docTypeId',
          label: 'Тип',
          field: 'docTypeName',
          sortable: true,
        },
        {
          name: 'docSeries',
          label: 'Серия',
          field: 'docSeries',
          sortable: true,
        },
        {
          name: 'docNumber',
          label: 'Номер',
          field: 'docNumber',
          sortable: true,
        },
        {
          name: 'createSource',
          label: 'Источник',
          field: 'createSourceInfo.title',
          sortable: true,
        },
        {
          name: 'epgu.guid',
          label: 'На ЕПГУ',
          field: (row) => row.epgu.guid ? 'да' : '',
          sortable: true,
        },
        {
          name: 'epgu.fui',
          label: 'Файл ЕПГУ ID',
          field: 'epgu.fui',
          sortable: true,
        },
      ],
    }
  },

}
</script>

<style lang="scss" scoped>


</style>
