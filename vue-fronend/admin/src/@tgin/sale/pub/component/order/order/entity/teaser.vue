<template>
  <div class="com" v-if="entity || true">

    <component
        :is="nav ? 'a' : 'div'"
        :href="entity.URL"
        class="com flex no-wrap-sm "
        @click.stop.prevent="onNav"
    >

      <div>
        <div class="q-mb-xs s-font-xs" style="color: #AAA;">
          {{ entity.DATE_FORMATTED }}
        </div>

        <div class="text-weight-bold">
           <span v-if="false">Заказ</span> № {{ entity.ACCOUNT_NUMBER }} на <span
            class="text-no-wrap">{{ $util.format.price(entity.PRICE, true) }}</span>
        </div>
      </div>

      <div class="q-ml-sm-auto q-mt-sm q-mt-sm-none -q-mt-md-sm text-right">

        <div :style="{color: entity.CSTATUS_COLOR }">
          {{ entity.CSTATUS_NAME }}
        </div>

      </div>

    </component>

    <div class="q-mt-sm q-pt-none q-mt-md-md q-pt-md-md border-t-md-1 border-primary-brown-1">

      <div class="row q-col-gutter-x-md q-col-gutter-y-md items-center">

        <div class="col-24 col-md-grow text-right order-md-last" style=" position: relative;">

          <CStatuses
              :statuses="statuses"
              class="q-pt-sm q-pt-md-none"
              :show-labels="false"
          />

        </div>

        <div class="col-24 col-md-grow order-md-first">

          <div class="c-status-mobile lt-md q-mb-sm" v-if="false">
            <div>{{ entity.STATUS.NAME }}</div>
          </div>

          <CActions
              :outline="actionsOutline"
              :item="entityData"
              :actions="orderActionsAccessible"
          />

        </div>

      </div>

    </div>


  </div>
</template>

<script>
import Base from './base'

export default {
  extends: Base,
  props: {},
  data() {
    return {
      viewMode: 'teaser'
    }
  },
}
</script>

<style lang="scss" scoped>

.com {

  > a {
    text-decoration: none;
  }
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
