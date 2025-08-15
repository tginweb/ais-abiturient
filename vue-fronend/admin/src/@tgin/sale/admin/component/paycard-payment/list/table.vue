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
  props: {},
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
          name: 'DATE_CREATE',
          label: 'Дата сощдания',
          sortable: true,
          field: 'DATE_CREATE'
        },
        {
          name: 'USER_ID',
          label: 'Пользователь',
          sortable: true,
          field: (row, get) => row.USER ? row.USER.NAME_FULL + ' [' + row.USER.ID + ']' : ''
        },
        {
          name: 'PAYCARD_ID',
          label: 'ID карты',
          sortable: true,
          field: 'PAYCARD_ID',
          link: (row) => ({name: 'sale:paycard', params: {entityId: row.PAYCARD_ID}})
        },
        {
          name: 'ORDER_ID',
          label: 'Номер / ID заказа',
          sortable: true,
          field: (row) => row.ORDER_NUMBER + ' / ' + row.ORDER_ID,
          link: (row) => ({name: 'sale:order.view', params: {entityId: row.ORDER_ID}})
        },
        {
          name: 'PAYMENT_ID',
          label: 'ID платежа',
          sortable: true,
          field: 'PAYMENT_ID',
        },
        {
          name: 'ATTEMPTS',
          label: 'Попытка',
          sortable: true,
          field: 'ATTEMPTS',
        },
        {
          name: 'STATUS',
          label: 'Статус',
          sortable: true,
          field: 'STATUS',
        },
        {
          name: 'ERROR',
          label: 'Ошибка',
          sortable: true,
          field: 'ERROR',
        },
        {
          name: 'LOG',
          label: 'Лог',
          sortable: true,
          field: 'LOG',
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
