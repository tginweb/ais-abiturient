<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filter-change="$emit('filterChange', $event)"
      v-bind="bind"
      selectionType="multiple"
  />

</template>

<script>
import MTableProxy from '@tgin/ui/core/component/data-table/mixin/table-proxy'
import * as cells from '../cell'

export default {
  components: {},
  mixins: [MTableProxy],
  props: {},
  data() {
    return {
      columns: [

        {
          name: 'nid',
          label: 'nid',
          sortable: true,
          field: 'nid'
        },
        {
          name: 'email',
          label: 'email',
          sortable: true,
          field: 'email'
        },
        {
          name: 'lastName',
          label: 'lastName',
          sortable: true,
          com: cells.person
        },
        {
          name: 'roles',
          label: 'roles',
          sortable: true,
          com: cells.roles
        },
        {
          name: 'abitOrdersCount',
          label: 'abitOrdersCount',
          sortable: true,
          field: 'abitOrdersCount'
        },
        {
          name: 'orders',
          label: 'orders',
          sortable: true,
          com: cells.orders
        },
        {
          name: 'phone',
          label: 'phone',
          sortable: true,
          field: 'phone'
        },
        {
          name: 'region',
          label: 'region',
          sortable: true,
          field: 'region.name'
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
