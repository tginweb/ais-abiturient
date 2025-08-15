<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actionsClose="true"
    :actions="actions"
    :loading="fetching"
    :title="$q.screen.gt.sm ? orderTitle : null"
    @hide="onHide"
    dialogWidth="550px"
  >
    <template v-if="entity" v-slot:head>

      <div class="row q-mb-md">
        <div class="col-24 col-sm-grow">
          <div class="">{{ entity.DATE_FORMATTED }}</div>
          <div class="text-h3 text-weight-bold q-my-none" v-if="$q.screen.lt.md">{{ orderTitle }}</div>
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

      <div class="q-mb-md q-mb-md-2lg q-pa-md border-1 border-primary-brown-1" v-if="entity.IS_ACTIVE && false">
        <CStatuses
          :statuses="statuses"
          :polling="pollingActive"
        />
      </div>

    </template>

    <template v-if="entity" v-slot:default>

      <div class="row q-col-gutter-x-xl q-col-gutter-y-md">

        <div class="col-24 col-lg-12">

          <div class="text-weight-bold q-mb-md s-font-md">
            Информация о заказе
          </div>

          <CFields :fields="fields"/>

        </div>

        <div class="col-24 col-lg-12">

          <div class="text-weight-bold q-mb-md s-font-md">
            Состав заказа
          </div>

          <CBasket :items="entity.ITEMS" :entity="entity"/>

        </div>

      </div>

    </template>

  </component>


</template>

<script>
import Base from './base'
import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  extends: Base,
  mixins: [MVRoute],
  props: {

  },
  data() {
    return {
    }
  },
  watch: {

  },
  computed: {
    actions() {
      return this.orderActionsAccessible
    }
  },
  created() {
    this.fetch()
  },
}
</script>

<style lang="scss" scoped>


</style>
