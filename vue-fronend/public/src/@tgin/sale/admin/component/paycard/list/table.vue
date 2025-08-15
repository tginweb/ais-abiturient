<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
  />

</template>

<script>
import MTableProxy from '@tgin/ui/core/component/data-table/mixin/table-proxy'

export default {
  components: {},
  mixins: [MTableProxy],
  props: {

  },
  data() {
    return {
      filtersDefaults: {},

      columns: [
        {
          name: 'ID',
          label: 'ID',
          sortable: true,
          field: 'ID'
        },
        {
          name: 'USER_ID',
          label: 'Пользователь',
          sortable: true,
          field: (row, get) => row.USER ? row.USER.NAME_FULL + ' [' + row.USER.ID + ']' : ''
        },
        {
          name: 'TITLE',
          label: 'Наименование',
          sortable: true,
          field: 'TITLE'
        },
        {
          name: 'DEFAULT',
          label: 'По умолчанию',
          sortable: true,
          field: 'DEFAULT',
          type: 'boolean'
        },
        {
          name: 'DATE_CREATE',
          label: 'Дата создания',
          sortable: true,
          field: 'DATE_CREATE',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
