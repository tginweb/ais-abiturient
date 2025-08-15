<template>

  <div class="q-gutter-sm">

    <q-spinner
        color="primary"
        size="2em"
        :thickness="2"
        v-if="row.generateProcess"
    />
    <div v-else>

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
