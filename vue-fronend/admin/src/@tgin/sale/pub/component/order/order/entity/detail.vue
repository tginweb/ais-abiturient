<template>

  <div>

    <div class="row q-mb-md">
      <div class="col-24 col-sm-grow">
        <div class="">{{ entity.DATE_FORMATTED }}</div>
        <div class="text-h3 text-weight-bold q-my-none">Заказ №{{ entity.ACCOUNT_NUMBER }} на {{ $util.format.price(entity.PRICE) }} </div>
      </div>
      <div class="col-24 col-sm-auto">
        <div>
          <div class="s-font-2xs text-primary-brown-gray-3 gt-sm">Статус заказа</div>
          <div :style="{color: entity.CSTATUS_COLOR }">
            {{ entity.CSTATUS_NAME }}
          </div>
        </div>
      </div>
    </div>

    <div class="q-mb-md q-mb-md-2lg q-pa-md border-1 border-primary-brown-1" v-if="entity.IS_ACTIVE">
      <CStatuses
        :statuses="statuses"
        :polling="pollingActive"
      />
    </div>

    <div class="row q-col-gutter-x-xl q-col-gutter-y-md ">

      <div class="col-24 col-md-12">

        <div class="text-weight-bold q-mb-md s-font-md">
          Информация о заказе
        </div>

        <CPayments
          :order="entity"
          :propsByCode="propsByCode"
          @pay="onNavPay"
          class="q-mb-md"
        />

        <CFields :fields="fields"/>

      </div>

      <div class="col-24 col-md-12">

        <div class="text-weight-bold q-mb-md s-font-md">
          Состав заказа
        </div>

        <CBasket :items="entity.ITEMS" :entity="entity"/>

      </div>

    </div>

    <div class="q-mt-md q-pt-sm border-t-1 border-primary-brown-1">
      <CActions
        :item="entity"
        :actions="orderActionsAccessible"
      />
    </div>

  </div>

</template>

<script>
import Base from './base'

export default {
  extends: Base,
  data() {
    return {
      actionProcess: true,
    }
  },
  computed: {


  }
}

</script>

<style lang="scss" scoped>


</style>
