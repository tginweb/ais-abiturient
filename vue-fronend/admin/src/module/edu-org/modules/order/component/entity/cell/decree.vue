<template >

  <div class="q-gutter-y-sm" v-if="row.decree">

    {{row.decree.name}}

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
