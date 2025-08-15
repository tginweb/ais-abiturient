<template>

  <div>

    Отзыв заявления
    <div v-if="row.entrantApp">
      № {{row.entrantApp.nid}} {{row.entrantApp.isBudget ? 'БЮДЖЕТ' : 'КОММЕРЦИЯ'}}
    </div>
    <div v-else>
      {{ row.response.GuidApplication }}
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
