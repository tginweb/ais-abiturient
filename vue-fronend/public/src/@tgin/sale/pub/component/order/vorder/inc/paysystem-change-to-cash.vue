<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    :loading="fetching"
    :title="pageTitle"
    @hide="onHide"
  >

    <div v-if="fromCardAuthError" class="q-mb-md q-px-sm q-py-sm text-red text-center border-1 border-red">
      Не удалось добавить карту оплаты
    </div>

    <div class="q-mb-md">Выберите способ оплаты при получении</div>

    <q-list class="q-mb-md">

      <q-item
        class="q-px-none items-start q-ml-2lg  min-height-auto"
        manual-focus
        tag="label"
      >
        <q-item-section class="col-shrink q-mr-sm">
          <q-radio v-model="paysystemId" :val="9" color="teal" dense/>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            Картой курьеру
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        class="q-px-none items-start q-ml-2lg items-center min-height-auto"
        manual-focus
        tag="label"
      >
        <q-item-section class="col-shrink q-mr-sm">
          <q-radio v-model="paysystemId" :val="1" color="teal" dense/>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            Наличными курьеру
          </q-item-label>
        </q-item-section>
      </q-item>

    </q-list>

  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MRoute, MVRoute],
  components: {},
  props: {
    fromCardAuthError: {},
    orderSubmitOnSuccess: {},
    onSuccess: {}
  },
  data() {
    return {
      paysystemId: 9,
    }
  },
  computed: {
    pageTitle() {
      return 'Сменить способ оплаты'
    },
    actions() {
      return [
        {
          label: this.orderSubmitOnSuccess ? 'Сменить способ и отправить заказ' : 'Сменить способ и продолжить оформление',
          color: 'primary',
          callback: this.onConfirm
        },
      ]
    }
  },
  methods: {
    onConfirm() {
      this.visible = false
      this.onSuccess({
        paysystemId: this.paysystemId
      })
    }
  }
}
</script>
<style lang="scss" scoped>



</style>
