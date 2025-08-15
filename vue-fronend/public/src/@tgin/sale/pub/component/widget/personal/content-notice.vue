<template>

  <div class="">

   Заказ создан

  </div>

</template>

<script>

export default {
  components: {

  },
  data() {
    return {
      ordersVars: {
        filter: {

        },
        nav: {
          limit: 1
        }
      },
      ordersResult: null,
      ordersState: {
        isLoading: false,
        skip: false
      },
      isMounted: false
    }
  },
  methods: {
    refetch() {
      this.$apollo.queries.orders.refetch()
    },
  },
  created() {
    this.$bus.on('entity:order.changed', this.refetch);
  },
  beforeDestroy() {
    this.$bus.off('entity:order.changed', this.refetch);
  },
}
</script>
<style lang="scss" scoped>


</style>
