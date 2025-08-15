<template>

  <div>

    <div v-if="order" class="cursor-pointer" @click.stop="onClick">
      <div class="text-weight-bold relative-position">
        {{ order.fio }}
      </div>
      <div class="q-mt-xs text-grey-7 text-no-wrap">
        {{ order.uid }}
      </div>
    </div>
    <div v-else>
      {{ row.response.GuidEntrant }}
    </div>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  methods: {
    onClick() {
      this.$router.push('/admin/edu/order/' + this.order.id + '/view')
    }
  },
  computed: {
    order() {
      return this.row.entrantOrder || (this.row.entrantApp && this.row.entrantApp.order)
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
