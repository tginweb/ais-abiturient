<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
      :tree-mode="true"
  />

</template>

<script>

import MTableProxy from "@tgin/ui/core/component/data-table/mixin/table-proxy";
import * as cells from "~module/file/component/entity/cell";

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

        {
          name: 'roleComputedLabel',
          label: 'Роль',
          field: (row) => {

            let prefix = ''

            if (row.depth) {
              for (let i = 0; i < row.depth; i++) {
                prefix += '&nbsp;&nbsp;&nbsp;&nbsp;'
              }
            }

            return prefix + row.roleComputedLabel
          },
          sortable: true,
        },
        {
          name: 'nid',
          label: 'nid',
          sortable: true,
          field: 'nid'
        },
        {
          name: 'order',
          label: 'order',
          sortable: true,
          com: cells.order
        },
        {
          name: 'filesize',
          label: 'Размер',
          field: 'filesize',
          sortable: true,
        },
        {
          name: 'epgu',
          label: 'Гос. услуги',
          com: cells.epgu,
          sortable: true,
        },
        {
          name: 'download',
          label: '',
          com: cells.download,
          sortable: true,
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
