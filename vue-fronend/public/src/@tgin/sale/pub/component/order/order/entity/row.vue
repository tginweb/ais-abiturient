<template>
  <component
    :is="nav ? 'a' : 'div'"
    :href="entity.URL"
    class="com block"
    @click.stop.prevent="onNav"
  >

    <div class="row">

      <div class="col-24 col-sm-grow">
        <div class="s-font-2xs text-primary-brown-gray-4">{{ entity.DATE_FORMATTED }}</div>
        <div class="text-weight-bold q-my-none">Заказ №{{ entity.ACCOUNT_NUMBER }} на {{ $util.format.price(entity.PRICE) }} </div>
      </div>

      <div class="col-24 col-sm-auto" :class="{'text-right': $q.screen.gt.sm}">

          <div class="s-font-2xs text-primary-brown-gray-3 q-mt-sm q-mt-sm-none">Статус заказа</div>
          <div :style="{color: entity.CSTATUS_COLOR }">
            {{ entity.CSTATUS_NAME }}
          </div>

      </div>

      <div v-if="basketShow">
        fff
      </div>

    </div>

  </component>
</template>

<script>
import Base from './base'

export default {
  extends: Base,
  props: {
    basketShow: {default: false}
  },
  data() {
    return {}
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

.com {
  text-decoration: none;
}

.c-status-step {
  text-align: center;
  background: #F8F5F2;
  padding: 5px 6px;
  border-radius: 50%;
  margin1: 0 20px 0 20px;

  width: 35px;
  height: 35px;

  line-height: 1;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  &.--done {
    background-color: #E6F7F2;
  }
}

</style>
