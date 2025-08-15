<template>

  <div>

    <div
        v-if="statusInfo"
        :style="{
          color: statusInfo.color
       }"
        class="s-badge"
    >
      {{ statusInfo.titleAdmin }}
    </div>

    <div class="s-font-4xs" v-if="false">
      {{row.state.message}}
    </div>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {
    statusInfo() {
      return this.row.state.statusInfo
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
