<template >
  <div>
    <div v-if="row.epgu.guid" class="q-gutter-sm">
      {{row.epgu.guid}}
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
