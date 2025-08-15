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
    nidField: {default: 'nid'},
  },
  data() {
    return {
      columns: [
        {
          name: 'orderNid',
          label: 'Абитуриент',
          com: cells.person,
          field: (row) => row.order.fio,
          sortable: true,
          group: true,
          table: false
        },
        {
          name: 'competition.name',
          label: 'Конкурс',
          field: 'competition.name',
          sortable: true,
        },
        {
          name: 'csource',
          label: 'Основа',
          field: 'competition.source.name',
          sortable: true,
        },


        {
          name: 'statusId',
          label: 'Статус',
          com: cells.status,
          sortable: true,
        },

        {
          name: 'cancelReasonTitle',
          label: 'Причина отклонения',
          field: 'cancelReasonTitle',
          sortable: true,
        },
        {
          name: 'cancelReasonMessage',
          label: 'Сообщение отклонения',
          com: cells.cancelReasonMessage,
          sortable: true,
        },
        {
          name: 'createSource',
          label: 'Источник',
          field: 'createSourceTitle',
          sortable: true,
        },
        {
          name: 'competitionUid',
          label: 'compet Uid',
          field: 'competitionUid',
          sortable: true,
        },
        {
          name: 'epgu',
          label: 'ЕПГУ Guid',
          field: 'epgu.appGuid',
          sortable: true,
        },
        {
          name: 'nid',
          label: 'ID заявления',
          field: 'nid',
          sortable: true,
          sticky: true
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
