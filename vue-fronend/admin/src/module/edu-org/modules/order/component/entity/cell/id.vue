<template >

  <div>

    <div class="text-light-blue-7 s-font-xs" style="border-radius: 6px;font-weight:600;">
      {{row.orderType && row.orderType.nameShort}}
    </div>

    <div class="q-mt-xs text-no-wrap">
      ID {{row.nid}}
    </div>

    <div class="q-mt-xs text-no-wrap" v-if="row.ais.aisId">
      АИС ID {{row.ais.aisId}}
    </div>

    <div class="q-mt-xs text-no-wrap" v-if="row.regnum">
      Рег № {{row.regnum}}
    </div>

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


</style>
