<template>

  <div>

    <ul class="q-pa-none q-ma-none">
      <li v-for="item of row.targetEntities" :key="item.id">
        {{ item.title }} [{{ item.id }}]
      </li>
    </ul>


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
