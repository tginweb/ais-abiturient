<template>

  <div>

    <div class="c-layout">

      <br/>

      <button @click="onClick">MORE</button>

    </div>

  </div>

</template>

<script>
  import Pager from './pager';

  export default {
    extends: Pager,
    props: {

    },
    data() {
      return {

      }
    },
  }
</script>

<style lang="scss" scoped>


</style>
