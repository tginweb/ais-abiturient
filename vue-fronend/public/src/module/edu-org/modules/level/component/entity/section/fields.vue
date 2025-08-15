<template>

  <div class="com s-info-section">

    <div class="row q-col-gutter-x-lg">

      <div
        v-for="(field, fieldIndex) of fields"
        :key="fieldIndex"
        class="col-12 q-mb-md"
      >

        <q-field
          :label="field.LABEL"
          borderless
          stack-label
        >
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{ field.VALUE }}</div>
          </template>
        </q-field>

      </div>

    </div>

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

    fields() {
      const result = []

      result.push({
        LABEL: 'Дата заказа',
        VALUE: this.orderData.DATE_FORMATTED
      })

      result.push({
        LABEL: 'Оплачен',
        VALUE: this.orderData.IS_PAID ? 'да' : 'нет'
      })

      result.push({
        LABEL: 'Способ оплаты',
        VALUE: this.orderData.PAYSYSTEM_NAME
      })

      result.push({
        LABEL: 'Служба доставки',
        VALUE: this.orderData.DELIVERY_SERVICE_NAME
      })

      return result
    }
  }
}
</script>


<style lang="scss" scoped>


</style>
