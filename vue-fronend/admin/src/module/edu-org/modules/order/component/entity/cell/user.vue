<template>

  <div class="q-gutter-sm">
    <div
        class="text-grey-8"
        style="max-width:110px;text-overflow1:ellipsis;overflow1: hidden;font-size: 11px;word-wrap: break-word;overflow-wrap: break-word;"
        v-if="row.user"
    >
      {{ row.user.email }}
    </div>
    <div v-else>
      нет
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
