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
import {responsePayload} from "../cell";

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
        {name: 'idJwt', label: 'idJwt', sortable: true, field: 'idJwt'},
        {name: 'response.GuidEntrant', label: 'Поступающий', sortable: true, com: cells.eventEntrant},
        {name: 'response.GuidApp', label: 'Заялвение', sortable: true, com: cells.eventApp},
        {name: 'type', label: 'type', sortable: true, field: 'type'},
        {name: 'title', label: 'title', sortable: true, field: 'title'},
        {name: 'eventView', label: 'Вид', sortable: true, com: cells.eventView},
        {
          name: 'responseError',
          label: 'responseError',
          sortable: true,
          com: cells.responsePayload,
        },
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
