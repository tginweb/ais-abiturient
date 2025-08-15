<template >

  <div>

    <div class="q-mb-xs">
      {{row.nid}}
    </div>

    <div class="text-grey-8">
      {{row.orderType && row.orderType.nameShort}}
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
