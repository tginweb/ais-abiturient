<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
  />

</template>

<script>

import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy"
import * as cells from "../cell";

export default {
  mixins: [MTableProxy],
  props: {
    selectionType: {default: 'multiple'},
    idField: {default: '_id'},
    nidField: {default: 'id'}
  },
  data() {
    return {
      columns: [
        {name: 'id', label: 'id', sortable: true, field: 'id'},

        //{name: 'title', label: 'title', sortable: true, field: 'title'},

        //{name: 'personFio', label: 'personFio', sortable: true, field: 'personFio'},
        //{name: 'personIdent', label: 'personIdent', sortable: true, field: 'personIdent'},

        //{name: 'args', label: 'args', sortable: true, com: cells.args},

        {name: 'type', label: 'type', sortable: true, field: 'type'},

        {name: 'args', label: 'args', sortable: true, com: cells.args},

        {
          name: 'responseSuccess',
          label: 'responseSuccess',
          sortable: true,
          com: cells.responseSuccess,
        },
        {
          name: 'responseError',
          label: 'responseError',
          sortable: true,
          com: cells.responseError,
        },


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
        {
          name: 'createAt',
          label: 'createAt',
          sortable: true,
          field: (row) => '<nobr>' + this.$util.date.timestampToFormat(row.createAt, 'DD MMMM HH:mm') + '</nobr>',
        },
      ],
    }
  },
  computed: {

    toolbarMenu1() {
      return [
        {
          title: 'Импорт',
          children: [
            {
              label: 'Сервис',
              type: 'dispatch',
              path: 'edu_ais_message/importQueue',
              params: {
                queue: 'service'
              }
            },
            {
              label: 'ЕПГУ',
              type: 'dispatch',
              path: 'edu_ais_message/importQueue',
              params: {
                queue: 'ais'
              }
            }
          ]
        },

        {
          title: 'Создать',
          type: 'dispatch',
          path: 'edu_ais_message/save',
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
