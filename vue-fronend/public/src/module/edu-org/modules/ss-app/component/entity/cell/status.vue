<template>

  <div>

    <div
       class="c-status-title q-mb-sm text-center"
       :style="{
          color: statusInfo.color
       }"
       v-if="statusInfo"
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
      return this.row.statusInfo
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
