<template functional>

  <div :class="data.staticClass || ''" class="" v-bind="data.attrs">

    <div v-if="props.row.ais.id">
      ID: {{ props.row.ais.id }}
    </div>
    <div v-else>
      нет в аис
    </div>

  </div>

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
