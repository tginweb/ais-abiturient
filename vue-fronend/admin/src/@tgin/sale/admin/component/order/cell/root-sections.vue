<template>

  <div class="q-gutter-sm">

    <ul class="q-ml-sm q-pl-lg">
      <li v-for="item of row.SECTIONS.ROOT">
        {{item.NAME}}
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
