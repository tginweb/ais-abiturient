<template>

  <div class="com s-info-section">

    <div class="__header">Льготы</div>

    <q-markup-table
      class="c-lgots s-table-data"
      flat
      v-if="benefitsData.quotes.length"
    >
      <thead>
      <tr class="text-left">
        <th class="dense">Наименование</th>
        <th class="dense text-right">Документ</th>
      </tr>
      </thead>
      <tbody>

      <tr
        class="__item"
        v-for="item in benefitsData.quotes"
      >
        <td class="__item__name dense">
          {{$store.getters['edu_quotaType/byId'][item.quotaType] && $store.getters['edu_quotaType/byId'][item.quotaType].name}}
        </td>
        <td class="__item__doc dense">
          <template v-if="item.haveDoc">
            {{item.doc.serial}}
            {{item.doc.number}}
          </template>
        </td>
      </tr>
      </tbody>

    </q-markup-table>
    <div v-else class="text-grey-7">
      не указаны
    </div>


  </div>



</template>

<script>

  export default {
    components: {},
    props: {
      order: {}
    },
    data() {
      return {
        orderData: this.order,
      }
    },
    watch: {
      order(val) {
        this.orderData = val
      }
    },
    computed: {
      benefitsData() {
        return this.orderData.anket.benefits
      }
    }
  }
</script>


<style lang="scss" scoped>


</style>
