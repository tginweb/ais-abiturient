<template>

  <div class="q-gutter-y-md">

    <div>
      {{row.fio}}
    </div>

    <div v-if="false">
      {{row.snils || row.passport}}
    </div>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {
    phone() {
      let phone
      this.row.appsAis.forEach(order => {
        if (order.phone)
          phone = order.phone
      })
      return phone
    }
  }
}
</script>

<style lang="scss" scoped>

.deleted, .deleted td {
  color: #d97d89 !important;
}

</style>
