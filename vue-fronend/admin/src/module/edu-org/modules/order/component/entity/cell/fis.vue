<template >
  <div class="q-gutter-sm">
    <div>
      <div v-if="row.fis.exported">
        выгружен
      </div>
      <div v-else>
        не выгружен
      </div>
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
