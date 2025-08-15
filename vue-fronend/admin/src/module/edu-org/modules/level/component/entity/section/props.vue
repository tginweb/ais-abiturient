<template>

  <div class="com s-info-section">

    <div
      v-for="(props, propGroupId) of propsByGroupId"
      :key="propGroupId"
      class="q-mb-md"
    >

      <div class="text-weight-bold">
        {{ $store.getters['sale/orderPropGroupsById'][propGroupId].NAME }}
      </div>

      <div class="row q-col-gutter-x-lg">

        <div
          v-for="(prop, propIndex) of props"
          :key="propIndex"
          class="col-12"
        >

          <q-field
            :label="prop.NAME"
            borderless
            stack-label
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{ prop.VALUE }}</div>
            </template>
          </q-field>

        </div>

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
    propsByGroupId() {
      return this.orderData.PROPS && this.orderData.PROPS.reduce((map, item) => {
        if (!map[item.GROUP_ID])
          map[item.GROUP_ID] = []
        map[item.GROUP_ID].push(item)
        return map
      }, {}) || {}
    },
  }
}
</script>


<style lang="scss" scoped>


</style>
