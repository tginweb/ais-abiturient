<template >

  <div class="q-gutter-y-sm" v-if="row.prezachCompetition">

    <div class="text-bold text-yellow-9 s-font-md">
      {{row.prezachCompetition.name}}
    </div>

    <div class="" v-if="false">
      {{row.prezachStatusName}}
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
