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
  props: {},
  data() {
    return {
      columns: [

        {
          name: '_id',
          label: '_id',
          sortable: true,
          field: '_id'
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
          field: 'lastName',
        },
        {
          name: 'firstName',
          label: 'firstName',
          sortable: true,
          field: 'firstName'
        },
        {
          name: 'secondName',
          label: 'secondName',
          sortable: true,
          field: 'secondName'
        },
        {
          name: 'region',
          label: 'region',
          sortable: true,
          field: 'region.name'
        },
        {
          name: 'phone',
          label: 'phone',
          sortable: true,
          field: 'phone'
        },
        {
          name: 'roles',
          label: 'roles',
          sortable: true,
          com: cells.roles
        },
        {
          name: 'orders',
          label: 'orders',
          sortable: true,
          com: cells.orders
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
