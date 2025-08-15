<template functional>

  <span :class="data.staticClass || ''" class="" v-bind="data.attrs">


      <div class="q-mg-sm" v-if="props.row.aisPorted">
          <nobr>В АИС</nobr>
          <div style="font-size: 13px; white-space: nowrap;">{{parent.$util.date.timestampToFormat(props.row.aisPorted, 'DD MMM HH:mm')}}</div>
      </div>

      <div class="">
          <b>{{props.row.aisPortedByOperator ? 'Поручено операторам' : ''}}</b>
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
