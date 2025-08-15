<template>
  <div class="flex1">
    <span
        :style="{
          backgroundColor: color,
          boxShadow: '-5px 0 0 ' + color + ', 10px 0 0 ' + color
        }"
        style="
            padding: 2px;
        "
        class="text-white q-px-xs"
        :title="row.STATUS_ID"
    >{{ row.STATUS_NAME }}</span>
  </div>
</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {
    color() {
      return this.row.STATUS_COLOR || '#aaa'
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
