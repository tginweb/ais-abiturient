<template>

  <div class="q-gutter-y-md">

    {{row.apps}}

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

.deleted, .deleted td {
  color: #d97d89 !important;
}

</style>
