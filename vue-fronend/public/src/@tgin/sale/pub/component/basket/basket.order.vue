<template>
  <div>

    <c-item
        v-for="(item, index) of basketItems"
        :key="index"
        :item="item"
        :class="{
          'c-item border-b-1 border-primary-brown-gray-1 border-b-last-0': true,
          'q-py-md': true
        }"
        @quantity="onItemQuantity"
        @remove="onItemRemove"
        @comment="onItemComment"
        @commentRemove="onItemCommentRemove"
        context="order"
        style="border-bottom-style: dashed;"
    />

  </div>
</template>

<script>
import CBasket from "./basket";
import CItem from "./item/item.order";

export default {
  extends: CBasket,
  components: {
    CItem
  },

}
</script>

<style lang="scss" scoped>

</style>
