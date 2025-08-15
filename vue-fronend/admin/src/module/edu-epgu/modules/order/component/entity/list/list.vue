<template>

  <div>

    <CDataList
      :columns="columns"
      :filtersQuery="filtersQuery"
      :query="query"
      :rowsMenu="rowsMenu"
      :toolbarMenu="toolbarMenu"
      :rowOpener="true"
      selectionType="multiple"
      storePrefix="edu_epgu_message/entity"
      :where="where"
    />

  </div>

</template>

<script>

import CDataList from '~module/cab/component/ui/data-list'

export default {
  components: {
    CDataList
  },
  props: {
    query: {},
    filtersQuery: {},
    where: {}
  },
  data() {
    return {
      columns: [
        {name: 'id', label: 'id', sortable: true, field: 'id'},
        {name: 'idJwt', label: 'idJwt', sortable: true, field: 'idJwt'},
        {name: 'queue', label: 'queue', sortable: true, field: 'queue'},
        {name: 'header.entityType', label: 'entityType', sortable: true, field: 'header.entityType'},
        {name: 'header.action', label: 'action', sortable: true, field: 'header.action'},

        {name: 'entityTarget', label: 'entityTarget', sortable: true, field: 'entityTarget'},

        {name: 'state.step', label: 'step', sortable: true, field: 'state.step'},
        {name: 'state.status', label: 'status', sortable: true, field: 'state.status'},
        {
          name: 'state.statusMessage',
          label: 'statusMessage',
          sortable: true,
          field: 'state.statusMessage',
        },
        {
          name: 'state.processed',
          label: 'processed',
          sortable: true,
          field: (row, get) => get(row, 'state.processed') ? 'да' : 'нет'
        },
        {name: 'error', label: 'error', sortable: true, field: 'payload.Error.Description'},
        {name: 'ops', label: 'Действия', opener: false, sortable: true, actions: true},
      ],
    }
  },
  computed: {

    rowsMenu() {
      const res = [
        'save', 'delete'
      ]

      res.push({
        label: 'Процес',
        confirm: true,
        type: 'dispatch',
        path: 'edu_epgu_message/entityActionMultiple',
        params: {
          action: 'process'
        }
      })

      return res
    },

    toolbarMenu() {
      return [
        {
          title: 'Импорт',
          children: [
            {
              label: 'Сервис',
              type: 'dispatch',
              path: 'edu_epgu_message/importQueue',
              params: {
                queue: 'service'
              }
            },
            {
              label: 'ЕПГУ',
              type: 'dispatch',
              path: 'edu_epgu_message/importQueue',
              params: {
                queue: 'epgu'
              }
            }
          ]
        },

        {
          title: 'Создать',
          type: 'dispatch',
          path: 'edu_epgu_message/save',
          params: {
            model: {

            }
          }
        },
      ]
    }

  },
  methods: {}
}
</script>

<style lang="scss" scoped>


</style>
