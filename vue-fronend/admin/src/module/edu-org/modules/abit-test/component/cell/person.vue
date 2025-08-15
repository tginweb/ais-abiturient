<template>

  <div>

    <div v-if="row.order" class="cursor-pointer" @click.stop="onClick">
      <div class="text-weight-bold relative-position">
        {{ row.order.fio }}
      </div>

      <div v-if="row.order.snils" class="q-mt-xs text-grey-7 text-no-wrap">
        {{ row.order.uid }}
      </div>
    </div>
    <div v-else>
      {{ row.orderId }}
    </div>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {},
  methods: {
    onClick() {
      this.$router.push('/admin/edu/order/' + this.row.orderId + '/view')
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
