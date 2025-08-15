<template functional>

  <div class="q-gutter-sm">
    <div
        class="text-grey-8"
        style="max-width:110px;text-overflow1:ellipsis;overflow1: hidden;font-size: 11px;word-wrap: break-word;overflow-wrap: break-word;"
        v-if="props.row.user"
    >
      {{ props.row.user.nid }}
    </div>
    <div v-else>
      нет
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
