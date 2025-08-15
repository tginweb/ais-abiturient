<template>

  <div class="s-font-3xs">

      <div style="white-space: nowrap">ИЗ: {{ this.$util.date.timestampToFormat(row.updateAt, 'DD MMMM HH:mm') }}</div>
      <div style="white-space: nowrap">СО: {{ this.$util.date.timestampToFormat(row.createAt, 'DD MMMM HH:mm') }}</div>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {
    title() {
      return this.row.anket.personal
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
