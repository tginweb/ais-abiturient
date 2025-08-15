<template>

  <div class="query-item">

  </div>

</template>

<script>
  import CEntity from './entity-base'

  export default {
    extends: CEntity,
    props: {

    },
    data() {
      return {

      }
    },
    methods: {

    },
    computed: {
      itemTitle() {
        return this.NAME
      },
    }
  }
</script>

<style lang="scss" scoped>

  .query-item {

  }

</style>
