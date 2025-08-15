<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
  />

</template>

<script>

import * as cells from './cell'

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
          name: 'orderNid',
          label: 'Абитуриент',
          com: cells.person,
          sortable: true,
        },
        {
          name: 'csubject',
          label: 'Предмет',
          field: 'subject.name',
          style: {
            fontWeight: 'bold'
          },
          sortable: true,
        },
        {
          name: 'passingType',
          label: 'Способ сдачи',
          field: 'passingTypeName',
          sortable: true,
        },
        {
          name: 'abitEgeBall',
          label: 'Балл версия абит.',
          field: 'abitEgeBall',
          sortable: true,
        },
        {
          name: 'resultBall',
          label: 'Балл реальный',
          field: 'resultBall',
          sortable: true,
        },
        {
          name: 'resultSourceDocTitle',
          label: 'Основание',
          field: 'resultSourceDocTitle',
          sortable: true,
        },
        {
          name: 'createSource',
          label: 'Создан',
          field: 'createSourceTitle',
          sortable: true,
        },
        {
          name: 'createAt',
          label: 'Дата создания',
          field: (row) => this.$util.date.timestampToFormat(row.createAt, 'DD MMM HH:mm'),
          sortable: true,
        },
        {
          name: 'updateAt',
          label: 'Дата изменения',
          field: (row) => this.$util.date.timestampToFormat(row.updateAt, 'DD MMM HH:mm'),
          sortable: true,
        },
        {
          name: 'institute',
          label: 'Дело на фак.',
          field: 'order.institute.name',
          sortable: true,
        },
        {
          name: 'instituteFirstApp',
          label: 'Фак. высшего пр-та',
          field: 'order.institute.name',
          sortable: true,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
