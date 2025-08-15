<template>

  <div>
    
    <div v-if="state.fetched && !entity">
      заказ не найден
    </div>
    <div v-else-if="entity">

      <div class="q-mb-lg" v-if="entity.IS_ACTIVE">
        В ближайшее время наши менеджеры свяжутся с вами, чтобы подвердить заказ
      </div>

      <div class="q-mb-lg">
        <CActions
            :item="entity"
            :actions="orderActionsAccessible"
        />
      </div>

      <div class="row q-mb-md">
        <div class="col-24 col-sm-grow">
          <div class="s-font-3xl font-heading q-my-none ">Заказ №{{ entity.ACCOUNT_NUMBER }} на {{ $util.format.price(entity.PRICE, true) }} </div>
        </div>
        <div class="col-24 col-sm-auto">

        </div>
      </div>

      <div class="row q-col-gutter-x-xl q-col-gutter-y-md ">

        <div class="col-24 col-md-12">

          <div class="flex">

            <div class="q-mb-md">
              <div class="s-font-2xs text-primary-brown-gray-3 gt-sm">Статус заказа</div>
              <div :style="{color: entity.CSTATUS_COLOR }">
                {{ entity.CSTATUS_NAME }}
              </div>
            </div>

            <div class="q-mb-sm q-ml-auto text-right " v-if="pollingActive">
              <ui-progress-spinner
                  size="1em"
                  class="q-mr-md"
              />
              Актуализируем
            </div>

          </div>

          <div class="q-mb-sm q-mb-md-2lg q-pa-md border-1 border-primary-brown-1" v-if="entity.IS_ACTIVE">
            <CStatuses :statuses="statuses"/>
          </div>

          <div class="text-weight-bold q-mb-md s-font-md">
            Информация о заказе
          </div>

          <CPayments
              :order="entity"
              :propsByCode="propsByCode"
              @pay="onNavPay"
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

    </div>
  </div>

</template>

<script>
import Base from './base'

export default {
  extends: Base,
  data() {
    return {
      refetchEnable: true,
      actionProcess: true
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
