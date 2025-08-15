<template functional>

  <span :class="data.staticClass || ''" v-bind="data.attrs">

    <div class="q-mb-sm" v-if="props.row.operatorUser">
        {{props.row.operatorUser && props.row.operatorUser.lastName + ' ' + props.row.operatorUser.firstName}}
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
