<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
  />

</template>

<script>

import * as cells from '../cell'
import MTableProxy from '@tgin/ui/core/component/data-table/mixin/table-proxy'

export default {
  components: {},
  mixins: [MTableProxy],
  props: {
    columnsHidden: {},
  },
  data() {
    return {
      columns: [
        {
          name: '_id',
          label: 'ID',
          sortable: true,
          com: cells.id,
          opener: false
        },
        {
          name: 'parent',
          label: 'Parent',
          sortable: true,
          com: cells.parent,
        },
        {
          name: 'fuserId',
          label: 'Сессия',
          sortable: true,
          com: cells.session,
          opener: false
        },
        {
          name: 'type',
          label: 'type',
          sortable: true,
          field: 'type'
        },
        {
          name: 'message',
          label: 'message',
          sortable: true,
          field: 'message'
        },
        {
          name: 'apiArgs',
          label: 'API path + args',
          sortable: true,
          com: cells.args,
          opener: false
        },
        {
          name: 'created',
          label: 'created',
          sortable: true,
          field: (row) => this.$util.date.timestampToFormat(row.created, 'DD.MM.YYYY HH:mm:ss.SSS')
        },
        {
          name: 'timer',
          label: 'timer',
          sortable: true,
          field: (row) => (row.timer / 1000) + ' сек.'
        },
      ],
    }
  },

}
</script>

<style lang="scss" scoped>


</style>
