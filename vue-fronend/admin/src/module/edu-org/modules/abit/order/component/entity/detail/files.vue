<template>

  <div>

    <ui-data-table
        :rows="entity.files"
        :columns="columns"
        :nav="{
          limit: 30
        }"
        id-field="_id"
        :tree-mode="true"
        :actions-column-enable="false"
    />

  </div>

</template>

<script>

import * as cells from '~module/file/component/entity/cell'

export default {
  props: {
    entity: {},
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
                prefix += '&nbsp;&nbsp;&nbsp;'
              }
            }

            return prefix + row.roleComputedLabel
          },
          sortable: true,
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
}
</script>

<style lang="scss" scoped>


</style>
