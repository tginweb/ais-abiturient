<template >

  <div>

    <div>
      {{row.ordersourceName}}
    </div>

    <div
        v-if="row.user"
        class="text-grey-8 q-mt-sm"
        style="max-width:110px;text-overflow1:ellipsis;overflow1: hidden;font-size: 12px;word-wrap: break-word;overflow-wrap: break-word;"
    >
      Аккаунт: {{ row.user ? row.user.email : '' }}
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
