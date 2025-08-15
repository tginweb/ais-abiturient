<template>

  <ui-data-table
      @update:nav="$emit('update:nav', $event)"
      @filterChange="$emit('filterChange', $event)"
      v-bind="bind"
  />

</template>

<script>

import * as cells from '../cell'
import MTableProxy from '@tgin/ui/core/component/data-table/mixin/table-proxy'

export default {
  components: {},
  mixins: [MTableProxy],
  props: {
    columnsHidden1: {default: () => (['SECTION_ROOT', 'SECTION'])},
  },
  data() {
    return {
      columns: [
        {
          name: 'ID',
          label: '№/ID',
          sortable: true,
          field: (row) => row.ACCOUNT_NUMBER,
          link: (row) => ({name: 'sale:order.view', params: {entityId: row.ID}})
        },
        {
          name: 'USER_ID',
          label: 'Покупатель',
          sortable: true,
          opener: false,
          com: cells.person,
        },
        {
          name: 'DATE_INSERT',
          label: 'Создан',
          sortable: true,
          field: (row) => this.$util.date.timestampToFormat(row.DATE_INSERT, 'DD.MM.YYYY HH:mm')
        },
        {
          name: 'BASKET',
          label: 'Товары',
          sortable: true,
          com: cells.basket
        },
        {
          name: 'DELIVERY_ID',
          label: 'Доставка',
          sortable: true,
          field: 'DELIVERY_SERVICE_NAME'
        },
        {
          name: 'PAY_SYSTEM_ID',
          label: 'Оплата',
          sortable: true,
          field: 'PAY_SYSTEM_NAME'
        },
        {
          name: 'PRICE',
          label: 'Сумма',
          sortable: true,
          field: (row) => this.$util.format.price(row.PRICE, true)
        },
        {
          name: 'IS_PAID',
          label: 'Оплачен',
          sortable: true,
          field: (row) => row.IS_PAID ? 'да' : 'нет'
        },
        {
          name: 'STATUS',
          label: 'Статус',
          sortable: true,
          com: cells.status
        },
        {
          name: 'SECTION_ROOT',
          label: 'Корень',
          sortable: true,
          com: cells.rootSection
        },
        {
          name: 'SECTION',
          label: 'Категория',
          sortable: true,
          com: cells.parentSections
        },

      ],
    }
  },
  computed: {


  },
  methods: {

    rowPreprocessFn(node) {

      const sections = (node.ITEMS ? node.ITEMS : []).reduce((map, item) => {

        if (item.ELEMENT) {

          if (item.ELEMENT.PARENT) {

            if (item.ELEMENT.PARENT.ROOT_SECTION) {
              map.ROOT[item.ELEMENT.PARENT.ROOT_SECTION.ID] = item.ELEMENT.PARENT.ROOT_SECTION
            }
            if (item.ELEMENT.PARENT.SECTION) {
              map.PARENT[item.ELEMENT.PARENT.SECTION.ID] = item.ELEMENT.PARENT.SECTION
            }

          } else {
            if (item.ELEMENT.ROOT_SECTION) {
              map.ROOT[item.ELEMENT.ROOT_SECTION.ID] = item.ELEMENT.ROOT_SECTION
            }
            if (item.ELEMENT.SECTION) {
              map.PARENT[item.ELEMENT.SECTION.ID] = item.ELEMENT.SECTION
            }
          }
        }

        return map
      }, {
        ROOT: {},
        PARENT: {},
      })

      if (sections.ROOT)
        sections.ROOT = Object.keys(sections.ROOT).map((k) => sections.ROOT[k])

      if (sections.PARENT)
        sections.PARENT = Object.keys(sections.PARENT).map((k) => sections.PARENT[k])

      const propsByCode = (node.PROPS ? node.PROPS : []).reduce((map, prop) => (map[prop.CODE] = prop, map), {})

      return {
        ...node,
        SECTIONS: sections,
        PROPS_BY_CODE: propsByCode
      }
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
