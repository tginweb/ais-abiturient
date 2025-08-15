<template functional>

  <span :class="data.staticClass || ''" v-bind="data.attrs" class="">

    {{props.row.direct_name}}

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
