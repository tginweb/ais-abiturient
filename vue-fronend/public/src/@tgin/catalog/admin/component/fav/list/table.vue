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
  mixins: [MTableProxy],
  components: {},
  props: {
    columnsHidden: {default: () => []},
  },
  data() {
    return {
      columns: [
        {
          name: 'ID',
          label: 'ID',
          sortable: true,
          field: 'ID'
        },
        {
          name: 'TYPE_NAME',
          label: 'Тип',
          sortable: true,
          field: 'TYPE_NAME'
        },
        {
          name: 'USER_ID',
          label: 'ID пользователя',
          sortable: true,
          field: 'USER_ID'
        },
        {
          name: 'FUSER_ID',
          label: 'ID покупателя',
          sortable: true,
          field: 'FUSER_ID'
        },
        {
          name: 'ELEMENT_ID',
          label: 'Товар',
          sortable: true,
          field: (row) => (row.ELEMENT ? row.ELEMENT.NAME : '') + ' [' + row.ELEMENT_ID + ']'
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
