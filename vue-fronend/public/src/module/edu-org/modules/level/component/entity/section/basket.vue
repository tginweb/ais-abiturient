<template>

  <div class="com s-info-section">

    <q-markup-table class="data-table text-left">
      <thead>
      <tr>
        <th class="" style="width: 100px;"></th>
        <th class="">Наименование</th>
        <th class="">Кол-во</th>
        <th class="">Цена</th>
        <th class="">Цена итого</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="item of basketItems"
        :key="item.ID"
      >
        <td class="">
          <img :src="item.PRODUCT.PICTURE.SRC" v-if="item.PRODUCT.PICTURE"/>
        </td>
        <td class="">{{ item.PRODUCT.NAME }}</td>
        <td class="">{{ item.QUANTITY }}</td>
        <td class="">{{ item.PRICE }}</td>
        <td class="">{{ item.FINAL_PRICE }}</td>
      </tr>
      </tbody>
    </q-markup-table>

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

    basketItems() {

      return this.orderData.ITEMS.map((item) => {
        return {
          ...item,
          PRODUCT: item.ELEMENT.PARENT ? item.ELEMENT.PARENT : item.ELEMENT
        }
      })
    }
  }
}
</script>


<style lang="scss" scoped>

.data-table {
  tbody td {
    font-size: 16px;
  }
}

</style>
