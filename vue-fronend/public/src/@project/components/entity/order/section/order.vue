<template>

  <div class="com s-info-section">

    <q-list class="__items">
      <q-item class="__item">
        <q-item-section class="__title">Текущий статус:</q-item-section>
        <q-item-section class="__value" side>

          <div v-bind="bindStatus" class="text-center q-pa-sm">
            {{ order.state.statusInfo.titleClient }}
          </div>

          <div v-if="order.state.message" class="q-pa-sm q-mt-md text-red-5">
            {{ order.state.message }}
          </div>

        </q-item-section>
      </q-item>
      <q-item class="__item">
        <q-item-section class="__title">№ заявления:</q-item-section>
        <q-item-section class="__value" side>
          {{orderData.nid}}
        </q-item-section>
      </q-item>
      <q-item class="__item">
        <q-item-section class="__title">ID заявления:</q-item-section>
        <q-item-section class="__value" side>
          {{orderData._id}}
        </q-item-section>
      </q-item>
      <q-item class="__item">
        <q-item-section class="__title">Тип заявления:</q-item-section>
        <q-item-section class="__value" side>
          {{orderData.orderType.name}}
        </q-item-section>
      </q-item>
      <q-item class="__item">
        <q-item-section class="__title">Создана:</q-item-section>
        <q-item-section class="__value" side>
          {{ $util.date.timestampToFormat(orderData.createAt, 'datetime') }}
        </q-item-section>
      </q-item>
    </q-list>

  </div>

</template>

<script>

  export default {
    components: {},
    props: {
      order: {}
    },
    data() {
      return {
        orderData: this.order,
      }
    },
    watch: {
      order(val) {
        this.orderData = val
      }
    },
    computed: {
      bindStatus() {
        let res = {
          class: {},
          style: {}
        }
        let statusInfo = this.order.state.statusInfo

        if (statusInfo) {
          res.style.backgroundColor = statusInfo.bgColor
          res.style.color = statusInfo.textColor
        }

        return res
      },

    }
  }

</script>

<style lang="scss" scoped>


</style>
