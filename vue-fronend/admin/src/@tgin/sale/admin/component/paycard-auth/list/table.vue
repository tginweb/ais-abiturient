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
          name: 'CONTEXT_NAME',
          label: 'Контекст',
          sortable: true,
          field: 'CONTEXT_NAME',
        },
        {
          name: 'CONTEXT_PARAMS',
          label: 'Контекст',
          sortable: true,
          field: 'CONTEXT_PARAMS',
        },
        {
          name: 'PROCESSED',
          label: 'Обработано',
          sortable: true,
          field: 'PROCESSED',
          type: 'boolean'
        },
        {
          name: 'SUCCESS',
          label: 'Успешно',
          sortable: true,
          field: 'SUCCESS',
          type: 'boolean'
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
