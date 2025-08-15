<template>

  <div>

    <div class="c-layout">

      <br/>

      <button @click="onClick">MORE</button>

    </div>

  </div>

</template>

<script>

  export default {

    methods: {

      onClick() {

        this.query.setFilter('a', 999)
        this.query.commit()
      },

    },

  }
</script>

<style lang="scss" scoped>


</style>
