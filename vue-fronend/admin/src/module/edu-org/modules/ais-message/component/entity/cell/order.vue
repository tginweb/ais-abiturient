<template>

  <div v-if="row.order">
    {{row.order.fio}} [{{row.order.nid}}]
  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
}
</script>

<style lang="scss" scoped>


</style>
