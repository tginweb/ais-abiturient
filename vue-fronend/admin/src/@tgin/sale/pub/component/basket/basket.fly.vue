<template>
  <router-link class="com" to="/cart">


    <div class="flex items-center">

      <div class="c-price s-font-xs leading-none text-weight-bold">
        {{$store.getters['sale_pub/basketPriceFormatted']}}
      </div>

      <div class="c-icon q-ml-xs">
        <q-icon :name="$icons.basket" size="17px"/>
      </div>

    </div>

    <div class="c-quantity s-font-4xs text-weight-bold">
      {{ $store.getters['sale_pub/basketCount'] }}
    </div>

  </router-link>
</template>

<script>
import CBasket from "./basket";

export default {
  name: 'basket.fly',
  extends: CBasket,
}
</script>

<style lang="scss" scoped>

.com {
  background-color: rgba(37, 37, 37, 0.8);
  border-radius: 4px;
  position: fixed;
  padding: 10px 12px 10px 10px;
  bottom: 20px;
  right: 20px;
  color: #FFF;
  z-index: 1000;

  a {
    color: #FFF;
  }
}

.c-icon {
  margin-top: -5px;
}

.c-quantity {
  position: absolute;
  right: 4px;
  top: 3px;
}
</style>
