<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
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
      columnsVisible: [
        'id',
        'lastName',
        'appsEpgu',
        'appsAis',
      ],
      columns: [
        { name: 'id', label: 'ID', field: 'id', sortable: true },
        { name: 'lastName', label: 'ФИО', com: cells.entrant, sortable: true},
        //  { name: 'docs', label: 'docs', com: cells.docs, sortable: true },
        { name: 'appsEpgu', label: 'Заявления ЕПГУ', com: cells.appsEpgu, sortable: true },
        { name: 'appsLk', label: 'Заявления ЛК', com: cells.appsLk, sortable: true },
        { name: 'appsAis', label: 'Заявления АИС', com: cells.appsAis, sortable: true },
        //{ name: 'achievementsEpgu', label: 'Достижения ЕПГУ', com: cells.achievementsEpgu, sortable: true },
        //{ name: 'achievementsAis', label: 'Достижения АИС', com: cells.achievementsAis, sortable: true },
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
