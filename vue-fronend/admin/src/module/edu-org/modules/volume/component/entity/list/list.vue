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
  props: {
  },
  data() {
    return {
      columns: [
        {
          name: 'id',
          label: 'ID',
          field: 'id',
          sortable: true,
        },
        {
          name: 'uid',
          label: 'UID',
          field: 'uid',
          sortable: true,
        },
        {
          name: 'name',
          label: 'Имя',
          field: 'name',
          sortable: true,
        },
        {
          name: 'ccampaign',
          label: 'ccampaign',
          field: 'campaign.name',
          sortable: true,
        },
        {
          name: 'cdirection',
          label: 'Направление',
          field: (row) => row.direction ? row.direction.name + ' [' + row.direction.id + ']' : '',
          sortable: true,
        },
        {
          name: 'okso',
          label: 'ОКСО',
          field: 'direction.cod',
        },
        {
          name: 'clevel',
          label: 'Уровень',
          field: 'level.name',
          sortable: true,
        },
        {
          name: 'budget_all',
          label: 'БЮДЖЕТ ВЕСЬ',
          field: (row) => row.budgetO + row.budgetOZ + row.budgetZ + row.quotaO +  row.quotaOZ +  row.quotaZ + row.targetO + row.targetOZ + row.targetZ + row.otdelO + row.otdelOZ + row.otdelZ,
          nowrap: true,
          sortable: true,
        },
        {
          name: 'budget',
          label: 'БЮДЖЕТ',
          field: (row) => row.budgetO + ' / ' + row.budgetOZ + ' / ' + row.budgetZ,
          nowrap: true,
          sortable: true,
        },
        {
          name: 'quota',
          label: 'ЛЬГОТА',
          field: (row) => row.quotaO + ' / ' + row.quotaOZ + ' / ' + row.quotaZ,
          nowrap: true,
          sortable: true,
        },
        {
          name: 'quota',
          label: 'ОТДЕЛЬНАЯ',
          field: (row) => row.otdelO + ' / ' + row.otdelOZ + ' / ' + row.otdelZ,
          nowrap: true,
          sortable: true,
        },

        {
          name: 'target',
          label: 'ЦЕЛЕВОЙ',
          field: (row) => row.targetO + ' / ' + row.targetOZ + ' / ' + row.targetZ,
          nowrap: true,
          sortable: true,
        },

        {
          name: 'paid',
          label: 'ПЛАТНЫЙ',
          field: (row) => row.paidO + ' / ' + row.paidOZ + ' / ' + row.paidZ,
          nowrap: true,
          sortable: true,
        },

      ],
    }
  },
  computed: {

  },
  methods: {}
}
</script>

<style lang="scss" scoped>


</style>
