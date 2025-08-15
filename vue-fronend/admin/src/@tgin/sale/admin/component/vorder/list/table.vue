<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filter-change="$emit('filterChange', $event)"
      v-bind="bind"
      selection-type="multiple"
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
          name: 'USER_ID',
          label: 'Пользователь',
          sortable: true,
          com: cells.person,
          opener: false
        },
        {
          name: 'FUSER_ID',
          label: 'ID покуптеля',
          sortable: true,
          field: 'FUSER_ID'
        },
        {
          name: 'ORDER_ID',
          label: 'Реальный заказ',
          sortable: true,
          field: (row) => row.ORDER ? row.ORDER.ACCOUNT_NUMBER + '/' + row.ORDER.ID + ' [' + row.ORDER.STATUS_NAME + ']' : null,
          link: (row) => ({name: 'sale:order.view', params: {entityId: row.ORDER_ID}}),
          opener: false
        },
        {
          name: 'SESSION_ID',
          label: 'ID сессии',
          sortable: true,
          field: 'SESSION_ID'
        },
        {
          name: 'PRICE',
          label: 'Стоимость',
          sortable: true,
          field: 'PRICE',
          type: 'price'
        },
      ],
    }
  },
  computed: {

  },
  methods: {
    rowPreprocessFn(node) {

      const propsByCode = (node.PROPS ? node.PROPS : []).reduce((map, prop) => (map[prop.CODE] = prop, map), {})

      return {
        ...node,
        PROPS_BY_CODE: propsByCode
      }
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
