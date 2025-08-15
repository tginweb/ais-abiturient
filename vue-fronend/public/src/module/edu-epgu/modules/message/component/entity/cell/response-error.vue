<template>

  <div>

    <json-viewer :value="row.response.payload.ErrorList" v-if="row.response && row.response.payload && row.response.payload.ErrorList" />

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
