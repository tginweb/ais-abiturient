<template>

  <div class="q-gutter-y-md">

    <div>
      {{row.fio}}
    </div>

    <div class="q-mt-xs text-grey-7">
      СНИЛС: {{row.snils}}
    </div>

    <q-badge color="green-5" v-if="row.egeRes && Object.values(row.egeRes).length">
      есть ЕГЭ
    </q-badge>

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

.deleted, .deleted td {
  color: #d97d89 !important;
}

</style>
