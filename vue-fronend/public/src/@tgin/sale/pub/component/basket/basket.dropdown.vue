<template>
  <div ref="com" class="com">

    <q-scroll-area
        :style="{
            height: scrollHeight + 'px'
          }"
        ref="scroll"
    >

      <div ref="items">

        <q-resize-observer @resize="onResize"/>

        <CBasketItemMobile
            v-for="(item, index) of basketItems"
            :key="index"
            :item="item"
            class="c-item q-py-md"
            @quantity="onItemQuantity"
            @remove="onItemRemove"
            @comment="onItemComment"
            :dropdown="true"
        />

      </div>

    </q-scroll-area>

    <div ref="bottom">

      <div class="c-summary">

      </div>

      <div class="q-pb-md q-px-md text-center q-mt-sm" v-if="basketItems.length">

        <q-btn
            color="primary"
            class="full-width"
            label="оформить заказ"
            outline
            size="14px"
            to="/order/"
        />

      </div>
    </div>


  </div>
</template>

<script>
import CBasket from './basket'

export default {
  name: 'basket.dropdown',
  extends: CBasket,
}
</script>

<style lang="scss" scoped>


.c-items {
  border: 1px solid #ddd;
}

.c-item {
  &:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
}

.c-summary {
  border: 1px solid #ddd;

  .c-summary__info {
    border-bottom: 1px solid #ddd;
  }

  .c-summary__freedeliver {
    border-bottom: 1px solid #ddd;
  }
}

.c-scroll {

  max-height: 80vh;

  /deep/ {
    .scroll {
      max-height: 80vh;
      height: auto !important;
    }
  }
}
</style>
