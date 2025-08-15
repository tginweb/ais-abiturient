<template>

  <div>

    <CDataList
      :columns="columns"
      :columnsVisible="columnsVisible"
      :filtersDefaults="filterDefaults"
      :filtersNames="filtersNames"
      :filtersQuery="filtersQuery"
      :query="query"
      :rowsMenu="rowsMenu"
      :toolbarMenu="toolbarMenu"
      selectionType="multiple"
      storePrefix="edu_epgu_task/entity"

    />

  </div>

</template>

<script>

import CDataList from '~module/cab/component/ui/data-list'
import * as cells from '../cell'


export default {
  components: {
    CDataList,
  },
  props: {
    query: {},
    filtersQuery: {},
    filtersNames: {}
  },
  data() {
    return {

      filterDefaults: {
        isRoot: true
      },
      columnsVisible: [
        'id',
        'parent',
        'type',
        'subtype',
        'idJwt',
        'state.step',
        'state.status',
        'targetEntities',
        'ops'
      ],
      columns: [
        {
          name: 'id',
          label: 'ID',
          sortable: true,
          opener: true,
          field: (row) => row.id
        },
        {
          name: 'parent',
          label: 'Parent',
          sortable: true,
          opener: true,
          field: (row) => row.parent
        },
        {
          name: 'type',
          label: 'Тип',
          sortable: true,
          opener: true,
          field: (row) => row.type
        },
        {
          name: 'subtype',
          label: 'Подтип',
          sortable: true,
          opener: true,
          field: (row) => row.subtype
        },
        {
          name: 'targetEntities',
          label: 'targetEntities',
          sortable: true,
          opener: false,
          com: cells.targetEntities
        },
        {
          name: 'idJwt',
          label: 'idJwt',
          sortable: true,
          opener: true,
          field: 'idJwt'
        },
        {
          name: 'state.step',
          label: 'Шаг',
          sortable: true,
          opener: true,
          field: (row) => row.state.step
        },
        {
          name: 'state.status',
          label: 'Статус',
          sortable: true,
          opener: true,
          field: (row) => row.state.status
        },
        {
          name: 'ops',
          label: 'Действия',
          sortable: true,
          actions: true
        },
      ],
    }
  },
  computed: {

    rowsMenu() {
      const res = [
        'save', 'delete'
      ]
      return res
    },

    toolbarMenu() {
      return [
        {
          title: 'Добавить',
          type: 'vrouter',
          path: '/cab/edu-epgu/task/add'
        }
      ]
    }

  },
  methods: {}
}
</script>

<style lang="scss" scoped>


</style>
