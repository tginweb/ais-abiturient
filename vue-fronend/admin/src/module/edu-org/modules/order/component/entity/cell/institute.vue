<template >

  <div class="q-gutter-y-sm">

    <div
        class="text-bold"
        :class="{
          'text-red': row.cinstitute && app.cfac && (app.cfac!==row.cinstitute)
        }"
    >
      {{ $util.base.deepGet(row, 'institute.name') }}
    </div>

  </div>

</template>

<script>
  export default {
    props: {
      row: {},
    },
    computed: {
      app() {
        return this.row.firstApp ? this.row.firstApp : null
      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
