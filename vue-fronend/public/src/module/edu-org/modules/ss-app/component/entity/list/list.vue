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
import * as cells from '../cell'

export default {
  mixins: [MTableProxy],
  props: {
    query: {},
    filtersQuery: {},
    filtersNames: {default: () => ([])}
  },
  data() {
    return {
      filterDefaults: {},
      columns: [
        {name: 'id', label: 'ID', field: 'id', sortable: true},
        {name: 'uid', label: 'UID', field: 'uid', sortable: true},
        {name: 'epguId', label: 'epguId', field: 'epguId', sortable: true},
        {name: 'cstatus', label: 'cstatus', field: 'cstatus', sortable: true},
        {name: 'statusName', label: 'statusName', field: 'statusName', sortable: true},

        {name: 'fio', label: 'ФИО', field: 'fio', sortable: true},
        {name: 'snils', label: 'СНИЛС', field: 'snils', sortable: true},

        {name: 'aisEntrants', label: 'Заявления АИС', com: cells.aisEntrants, sortable: true},

        {name: 'fac', label: 'fac.name', field: 'admission.fac.name', sortable: true},

        {name: 'fob', label: 'fob.name', field: 'admission.fob.name', sortable: true},

        {name: 'abbr', label: 'admission.abbr', field: 'admission.name', sortable: true},

        {name: 'competitionName', label: 'competitionName', field: 'competitionName', sortable: true},
        {name: 'finsourceName', label: 'finsourceName', field: 'finsourceName', sortable: true},


        {
          name: 'dateRegister',
          label: 'dateRegister',
          field: (row) => this.$util.date.timestampToFormat(row.dateRegister, 'DD MMMM'),
          sortable: true
        },
        {
          name: 'dateChanged',
          label: 'dateChanged',
          field: (row) => this.$util.date.timestampToFormat(row.dateChanged, 'DD MMMM HH:mm'),
          sortable: true
        },


        {
          name: 'agreement',
          label: 'Согласие',
          field: (row) => row.agreement ? 'да (' + row.agreementDate + ')' : '',
          sortable: true
        },
        {
          name: 'deny',
          label: 'Отказ',
          field: (row) => row.deny ? 'да (' + row.denyDate + ')' : '',
          sortable: true
        },

        {name: 'epguData', label: 'epguData', field: (row) => row.epguData && row.epguData.AppNumber, sortable: true},

      ]
    }
  },
  computed: {


  },
  methods: {}
}
</script>

<style lang="scss" scoped>


</style>
