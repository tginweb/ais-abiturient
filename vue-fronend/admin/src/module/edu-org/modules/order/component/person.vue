<template>

  <div>

    <div v-if="order" class="cursor-pointer" @click.stop="onClick">
      <div class="text-weight-bold relative-position">
        {{ order.fio }}
      </div>
      <div v-if="order.uid" class="q-mt-xs text-grey-7 text-no-wrap">
        {{ order.uid }}
      </div>
    </div>
    <div v-else>
      {{ order.orderId }}
    </div>

  </div>

</template>

<script>
export default {
  props: {
    order: {},
  },
  computed: {},
  methods: {
    onClick() {
      this.$router.push('/admin/edu/order/' + this.order.id + '/view')
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
