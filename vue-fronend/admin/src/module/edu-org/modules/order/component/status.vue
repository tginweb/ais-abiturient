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

  </div>

</template>

<script>
export default {
  props: {
    order: {},
  },
  computed: {
    statusInfo() {
      return this.order.state.statusInfo
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>


</style>
