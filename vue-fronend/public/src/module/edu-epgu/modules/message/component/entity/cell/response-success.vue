<template>

  <div>

    <json-viewer :value="row.response.payload.SuccessResultList" v-if="row.response && row.response.payload && row.response.payload.SuccessResultList"/>

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
