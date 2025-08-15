<template >

  <div class="q-gutter-sm">
    <div v-if="row.epgu.guid">
      <json-viewer :value="row.epgu"/>
    </div>
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
