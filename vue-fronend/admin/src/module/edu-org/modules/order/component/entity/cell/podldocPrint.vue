<template >

  <div class="">

    <div v-if="row.podldoc" class="text-green-9">
      Печатный оригинал у нас
    </div>

  </div>

</template>

<script>
  export default {
    props: {
      row: {},
    },
    computed: {

    }
  }
</script>

<style lang="scss" scoped>


</style>
