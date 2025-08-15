<template>

  <div
      v-if="statusInfo && row.state.status!==row.portedStatus"
  >
    в старом ЛК
    <div
        :style="{
          color: statusInfo.color
       }"
        class="s-badge"
    >
      {{ statusInfo.titleAdmin }}
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
      return this.row.portedStatusInfo
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
