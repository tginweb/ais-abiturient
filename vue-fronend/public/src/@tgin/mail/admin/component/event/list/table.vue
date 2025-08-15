<template>

  <div>
  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
      selection-type="multiple"
  />
  </div>

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
          field: 'ID',
        },
        {
          name: 'EVENT_NAME',
          label: 'Код события',
          sortable: true,
          field: 'EVENT_NAME',
        },
        {
          name: 'EVENT.NAME',
          label: 'Наименование события',
          sortable: true,
          field: 'EVENT.NAME',
        },
        {
          name: 'MESSAGE_ID',
          label: 'Шаблон',
          sortable: true,
          field: 'MESSAGE_ID',
        },
        {
          name: 'USER_ID',
          label: 'Пользователь',
          sortable: true,
          field: (row) => row.USER ? ((row.USER ? row.USER.LOGIN : '') + ' [' + row.USER_ID + ']') : (row.ORDER ? ((row.ORDER.USER ? row.ORDER.USER.LOGIN : '') + ' [' + row.ORDER.USER_ID + ']') : '' )
        },
        {
          name: 'ORDER_ID',
          label: 'Номер / ID заказа',
          sortable: true,
          field: (row) => row.ORDER ? row.ORDER.ACCOUNT_NUMBER + ' / ' + row.ORDER.ID : ''
        },
        {
          name: 'DATE_INSERT',
          label: 'Дата создания',
          sortable: true,
          field: 'DATE_INSERT',
        },
        {
          name: 'DATE_EXEC',
          label: 'Дата отправки',
          sortable: true,
          field: 'DATE_EXEC',
        },
        {
          name: 'SUCCESS_EXEC',
          label: 'Успешно',
          sortable: true,
          field: 'SUCCESS_EXEC',
          type: 'boolean'
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
