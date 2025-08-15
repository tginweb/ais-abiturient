<template functional>

  <span :class="data.staticClass || ''" v-bind="data.attrs" class="">

    <div class="text-weight-bold q-mb-xs">
      {{props.row.nid}}
    </div>

    <div class="text-grey-8">
      {{parent.getTermByNid('abit.eduType', props.row.eduType, 'nameShort')}}
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
