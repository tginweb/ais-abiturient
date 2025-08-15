<template>

  <component
      v-bind="pageViewBind"
      :path="pagePathFull"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
  >

    <div class="c-panel q-px-md q-px-lg-none q-mt-md q-mt-lg-none">

      <entity-sale-order-detail
        v-if="entity"
        :entityData="entity"
        class=""
      />

    </div>

  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"

export default {
  mixins: [MRoute],
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
    pagePath() {

      const path = [
        {
          url: this.$app.getRouteByName('sale:orders', 'path'),
          label: 'Заказы'
        },
      ]

      if (this.entity) {
        path.push({
          label: 'Заказ ' + this.entity.ACCOUNT_NUMBER
        })
      }
      return path
    },
  },
  async created() {
    await this.fetch()
  },
  methods: {
    async fetch() {
      try {
        this.entity = await this.$store.dispatch('sale_pub/userOrderFetch', {
          id: parseInt(this.entityId),
          options: {
            state: this.requestState,
          }
        })
      } catch (e) {

      }
    }
  }
}
</script>
<style lang="scss" scoped>

.c-panel {
  background-color1: #F8F5F2;
}

</style>
