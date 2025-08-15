<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
      :group-actions="false"
  />

</template>

<script>

import * as cells from './cell'

import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";

export default {
  mixins: [MTableProxy],
  props: {
    idField: {default: '_id'},
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
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
