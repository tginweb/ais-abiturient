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
        {name: 'id', label: 'ID', field: 'id', sortable: true},

        {name: 'orderName', label: 'Наименование', field: 'orderName', sortable: true},
        {name: 'orderNumber', label: 'Номер приказа', field: 'orderNumber', sortable: true},

        {name: 'cfob', label: 'Форма', field: 'fob.name', sortable: true},
        {name: 'csource', label: 'Источник', field: 'source.name', sortable: true},
        {name: 'сlevel', label: 'Уровень', field: 'level.name', sortable: true},

        {name: 'corderAdmissionStatus', label: 'orderAdmissionStatus', field: 'orderAdmissionStatus.name', sortable: true},
        {name: 'corderAdmissionType', label: 'orderAdmissionType', field: 'orderAdmissionType.name', sortable: true},

        {
          name: 'orderDate',
          label: 'orderDate',
          field: (row) => this.$util.date.timestampToFormat(row.orderDate, 'DD MMMM HH:mm'),
          sortable: true
        },
        {
          name: 'publishDate',
          label: 'publishDate',
          field: (row) => this.$util.date.timestampToFormat(row.publishDate, 'DD MMMM HH:mm'),
          sortable: true
        },

      ]
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
