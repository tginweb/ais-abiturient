<template>

  <div class="com s-info-section">

    <div class="__header">Индивидуальные достижения</div>

    <q-markup-table
      class="c-achievements s-table-data"
      flat
      v-if="entranceData.achievements.length"
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
        v-for="item in entranceData.achievements"
      >
        <td class="__item__name dense">
          {{item.achievementTypeDoc && item.achievementTypeDoc.name}}
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
      entranceData() {
        return this.orderData.anket.entrance
      }
    }
  }
</script>


<style lang="scss" scoped>


</style>
