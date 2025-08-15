<template>

  <CDataList
    :columns="columns"
    :filtersDefaults="filterDefaults"
    :filtersNames="filtersNames"
    :filtersQuery="() => require('../../../gql/list/query/filters.gql')"
    :query="() => require('../../../gql/list/query/listRecordset.gql')"
    id-field="id"
    selectionType="multiple"
    actions-field="adminActions"
  />

</template>

<script>

import CDataList from '~module/cab/component/ui/data-list'
import MDataListExtendEpgu from '~module/edu-epgu/component/mixin/data-list-extend-epgu'
import * as cells from '../cell'


export default {
  components: {
    CDataList
  },
  mixins: [MDataListExtendEpgu],
  props: {
    query: {},
    filtersQuery: {},
    filtersNames: {default: () => ([])}
  },
  data() {
    return {
      filterDefaults: {},
      columns: [
        { name: 'id', label: 'ID', field: 'id', sortable: true },
        { name: 'csnap', label: 'Снапшот', field: 'snap.id', sortable: true },
        { name: 'cadmission.abbr', label: 'Аббр', field: 'admission.abbr', sortable: true },
        { name: 'cadmission', label: 'Направление', field: 'admission.direct_name', sortable: true },
        { name: 'csource', label: 'Основа', field: 'source.name', sortable: true },
        { name: 'admissionNumber', label: 'Набор', field: 'admissionNumber', sortable: true },
        { name: 'apps', label: 'Заявления', field: (row) => row.apps.length, sortable: true },
      ],
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
