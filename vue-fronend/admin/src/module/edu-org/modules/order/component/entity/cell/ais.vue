<template>

  <div class="q-gutter-sm">

      <div v-if="row.ais.aisId">

        <div class="">ID: {{row.ais.aisId}}</div>

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
