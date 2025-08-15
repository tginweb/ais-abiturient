<template>

  <div class="q-gutter-sm">

    <div>
      {{ [row.lastName, row.firstName, row.secondName].join(' ') }}
    </div>

    <div class="text-grey-8" v-if="row.snils">
      СНИЛС: {{ row.snils }}
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
