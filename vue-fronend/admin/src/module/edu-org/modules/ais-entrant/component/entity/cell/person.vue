<template>
  <div class="q-gutter-y-sm">
    <div>
      <b>{{row.fio}}</b>
    </div>
    <div>
      {{row.snils}}
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
