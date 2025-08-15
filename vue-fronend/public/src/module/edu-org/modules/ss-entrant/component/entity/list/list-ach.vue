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
  },
  data() {
    return {
      columns: [
        { name: 'fac', label: 'Факультет', com: cells.fac, report: true, sortable: true },

        { name: 'id', label: 'ID', field: 'id', sortable: true },
        { name: 'fio', label: 'ФИО', field: 'fio', sortable: true},
        { name: 'snils', label: 'Снилс', field: 'snils', sortable: true},
        { name: 'dateRegister', label: 'Дата', field: (row, get) => this.$util.date.timestampToFormat(row.dateRegister, 'DD MMM'), sortable: true},

        { name: 'appsEpgu', label: 'Заявления ЕПГУ', com: cells.appsEpgu, sortable: true },
        //{ name: 'appsLk', label: 'Заявления ЛК', com: cells.appsLk, sortable: true },
        { name: 'appsAis', label: 'Заявления АИС', com: cells.appsAis, sortable: true, report: true },

        { name: 'achievementsEpgu', label: 'Достижения ЕПГУ', com: cells.achievementsEpgu, sortable: true },
        { name: 'achievementsAis', label: 'Достижения АИС', com: cells.achievementsAis, sortable: true },
      ]
    }
  },
  computed: {


  },
  methods: {


  }
}
</script>

<style lang="scss" scoped>


</style>
