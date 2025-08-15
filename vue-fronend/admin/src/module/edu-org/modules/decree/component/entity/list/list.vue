<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
      selection-type="multiple"
  />

</template>

<script>

import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";

export default {
  mixins: [MTableProxy],
  components: {

  },
  props: {
  },
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
          name: 'name',
          label: 'Имя',
          sortable: true,
          field: 'name'
        },
        {
          name: 'aisNumber',
          label: 'aisNumber',
          sortable: true,
          field: 'aisNumber'
        },
        {
          name: 'aisId',
          label: 'aisId',
          sortable: true,
          field: 'aisId'
        },
        {
          name: 'pubDate',
          label: 'pubDate',
          sortable: true,
          field: (row) => this.$util.date.timestampToFormat(row.pubDate, 'DD MMMM YYYY')
        },
        {
          name: 'ordersCount',
          label: 'ordersCount',
          sortable: true,
          field: 'ordersCount'
        },
        {
          name: 'ccampaign',
          label: 'campaign',
          sortable: true,
          field: 'campaign.name'
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
