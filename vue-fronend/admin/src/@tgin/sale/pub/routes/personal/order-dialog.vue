<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :title="orderTitle"
      @hide="onHide"
      :actions="actions"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
  >

    <template v-if="entity" v-slot:default>

      <div class="row q-mb-md ">

        <div class="col-auto">
          <div class="s-font-2xs text-primary-brown-gray-3">Дата создания</div>
          <div class="">{{ entity.DATE_FORMATTED }}</div>
        </div>

        <div class=" col-24 col-sm-grow q-mt-sm q-mt-sm-none" :class="{'text-right': $q.screen.gt.xs}">
          <div>
            <div class="s-font-2xs text-primary-brown-gray-3">Статус заказа</div>
            <div :style="{color: entity.CSTATUS_COLOR }" class="text-weight-bold">
              {{ entity.CSTATUS_NAME }}
            </div>
          </div>
        </div>

      </div>

      <div class="q-mb-md q-mb-md-2lg q-pa-md border-1 border-primary-brown-1" v-if="entity.IS_ACTIVE || true">
        <CStatuses
            :statuses="statuses"
            :polling="pollingActive"
        />
      </div>

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
import MVRoute from '@tgin/main/router/mixin/vroute'
import CParent from '../../component/order/order/entity/base'

export default {
  extends: CParent,
  mixins: [MVRoute],
  components: {

  },
  props: {
    entityId: {},
  },
  data() {
    return {
      page: {
        title: 'Заказ',
      },
      refetchInterval: null,
      entity: null,
      loaded: false
    }
  },
  computed: {
    actions() {
      return this.orderActionsAccessible
    },
  },
  async created() {
    await this.fetch()
  },
  methods: {
    async fetch() {
      try {
        const entity = await this.$store.dispatch('sale_pub/userOrderFetch', {
          id: this.entityIdState,
          options: {
            state: this.requestState
          }
        })
        this.assignEntity(entity, this.requestState)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.c-panel {
  background-color: #F8F5F2;
}

</style>
