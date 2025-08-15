<template>
  <div class="">

    <q-tab-panel class="q-px-none relative-position" name="basket">

      <q-table
        :columns="columns"
        :data="items"
        class="c-table s-table-data"
        row-key="ID"
        style="height: calc(100vh - 150px);"
        :rows-per-page-options="[10, 30, 50, 100, 200, 300, 500, 1000, 2000, 3000, 4000, 5000, 10000, 15000, 20000, 50000]"
        virtual-scroll
        :loading="loading"
        :pagination="pagination"
        @update:pagination="$emit('update:pagination', $event)"
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
          >
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :style="{ whiteSpace: col.nowrap ? 'nowrap !important' : ''}"
            >

              <component
                :is="typeof col.com === 'function' ? col.com() : col.com"
                v-if="col.com"
                v-bind="col.props || {}"
                :row="props.row"
              />

              <template v-else-if="col.field">

                <div
                  v-html="typeof col.field === 'function' ? col.field(props.row, $util.base.deepGet) : $util.base.deepGet(props.row, col.field)"
                />

              </template>

            </q-td>
          </q-tr>

        </template>
      </q-table>

      <q-inner-loading :showing="loading">
        <q-spinner-gears color="primary" size="50px"/>
      </q-inner-loading>

    </q-tab-panel>

  </div>
</template>

<script>

import * as cells from '../cell'

export default {
  components: {},
  props: {
    items: {},
    loading: {},
    pagination: {}
  },
  data() {
    return {

      columns: [
        {label: 'ID', sortable: true, name: 'ID', field: 'ID'},
        {label: 'Order ID', sortable: true, name: 'ORDER_ID', field: 'ORDER_ID'},
        {label: 'Покупатель', sortable: true, name: 'BUYER_NAME', field: 'BUYER_NAME'},
        {
          label: 'Договор',
          sortable: true,
          name: 'CONTRACT_NUM',
          com: cells.contract
        },
        {label: 'Наименование', sortable: true, name: 'NAME', field: 'NAME'},
        {label: 'Количество', sortable: true, name: 'QUANTITY', field: 'QUANTITY'},
        {label: 'Цена', sortable: true, name: 'PRICE', field: 'PRICE'},
        {label: 'Цена Итог', sortable: true, name: 'FINAL_PRICE', field: 'FINAL_PRICE'},
        {label: 'Оплачен', sortable: true, name: 'PAID', field: 'PAID'},
        {label: 'Дата оплаты', sortable: true, name: 'PAID_DATE_FORMATTED', field: 'PAID_DATE_FORMATTED'},
        {label: 'Корневой раздел', sortable: true, name: 'ROOT_SECTION_NAME', field: 'ROOT_SECTION_NAME'},
        {label: 'Раздел', sortable: true, name: 'SECTION_NAME', field: 'SECTION_NAME'},
      ],
    }
  },

}
</script>
<style lang="scss" scoped>


</style>
