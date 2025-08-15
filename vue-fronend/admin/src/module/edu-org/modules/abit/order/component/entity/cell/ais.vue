<template functional>

  <div class="q-gutter-sm">

      <div class="q-mb-sm" v-if="props.row.aisPorted">
          <div style="font-size: 13px; white-space1: nowrap;">с {{parent.$util.date.timestampToFormat(props.row.aisPorted, 'DD MMM HH:mm')}}</div>
      </div>

      <div class="">
          <b>{{props.row.aisPortedByOperator ? 'Поручено операторам' : ''}}</b>
      </div>

      <div v-if="props.row.ais.aisId">
        АИС ID {{props.row.ais.aisId}}
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
