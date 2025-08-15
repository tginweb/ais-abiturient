<template functional>

  <span v-bind="data.attrs" :class="data.staticClass || ''" class="">

   {{ props.row.name }}

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
