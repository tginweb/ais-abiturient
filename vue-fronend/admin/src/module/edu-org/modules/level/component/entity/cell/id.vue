<template functional>

  <span :class="data.staticClass || ''" v-bind="data.attrs" class="">

    <div class="text-weight-bold q-mb-xs">
      {{props.row.id}}
    </div>

  </span>

</template>

<script>
  export default {
    functional: true,
    props: {
      row: {},
    },
  }
</script>

<style lang="scss" scoped>


</style>
