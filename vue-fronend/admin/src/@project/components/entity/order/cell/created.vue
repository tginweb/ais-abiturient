<template functional>

  <span :class="data.staticClass || ''" v-bind="data.attrs" class="">

    <span style="display: block; font-size: 14px;">{{parent.$util.date.timestampToFormat(props.row.createAt, 'DD MMM')}}</span>

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
