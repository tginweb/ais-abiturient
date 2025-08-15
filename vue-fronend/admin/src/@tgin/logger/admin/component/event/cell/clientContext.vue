<template>

  <div>

    <json-viewer
        :value="row.clientContext"
        sort
        :expand-depth=1
        v-if="row.clientContext"
    >
    </json-viewer>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
  /deep/ {
    .jv-container {
      background-color1: transparent;
    }
    .jv-code {
      padding: 4px 6px;
    }
  }

</style>
