<template>

  <div>

    <div
       class="c-status-title q-mb-sm text-center"
       :style="{
          color: statusInfo.color
       }"
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
    bindStatus() {
      let res = {
        class: {},
        style: {}
      }
      let statusInfo = store.getters['abit/orderStatusesInfoByCode'][row.state.status]

      if (statusInfo) {
        res.style.color = statusInfo.color
      }

      return res
    },

    statusInfo() {
      return this.row.state.statusInfo
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
