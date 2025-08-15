<template >

  <div class="q-gutter-y-sm">

    <div class="text-bold">
      {{ $util.base.deepGet(app, 'competition.name') }}
    </div>

    <div v-if="row.cinstitute && app.cfac && (app.cfac!==row.cinstitute)" class="text-red">
      {{app.fac.name}}
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
