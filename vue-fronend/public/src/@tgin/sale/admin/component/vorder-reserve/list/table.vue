<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filter-change="$emit('filterChange', $event)"
      v-bind="bind"
  />

</template>

<script>
import MTableProxy from '@tgin/ui/core/component/data-table/mixin/table-proxy'
import * as cells from '../cell'

export default {
  components: {},
  mixins: [MTableProxy],
  data() {
    return {
      columns: [
        {
          name: 'ID',
          label: 'ID',
          sortable: true,
          field: 'ID',
          link: (row) => ({name: 'sale:vorder', params: {entityId: row.ID}}),
          opener: false
        },

        {
          name: 'DEPARTMENT_ID',
          label: 'Филиал',
          sortable: true,
          field: 'DEPARTMENT.NAME',
        },

        {
          name: 'VORDER_ID',
          label: 'Ордер',
          sortable: true,
          field: 'VORDER_ID',
          link: (row) => ({name: 'sale:vorder', params: {entityId: row.VORDER_ID}})
        },
        {
          name: 'NEED_NEAREST',
          label: 'Ближ',
          sortable: true,
          field: 'NEED_NEAREST',
          type: 'boolean'
        },

        {
          name: 'DATE_REQUEST',
          label: 'Дата запроса',
          sortable: true,
          field: 'DATE_REQUEST_FORMATTED',
        },

        {
          name: 'DATE_NEED',
          label: 'Дата нужна',
          sortable: true,
          field: 'DATE_NEED_FORMATTED',
        },

        {
          name: 'DATE_SUGGESTED',
          label: 'Дата предложена',
          sortable: true,
          field: 'DATE_SUGGESTED_FORMATTED',
        },

        {
          name: 'NEED_DELTA',
          label: 'Дельта к нужной',
          sortable: true,
          field: 'NEED_DELTA',
          com: cells.delta
        },

        {
          name: 'DATE_NEED_s',
          label: 'Дата нужна',
          sortable: true,
          field: 'DATE_NEED',
        },
      ],
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>


</style>
