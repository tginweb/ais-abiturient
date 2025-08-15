<template>
    <div class="q-gutter-y-md">
      <div>
        {{row.eduEpguLevel}}
      </div>
      <div>
        {{school && school.name}}
      </div>
    </div>
</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {

    school() {
      return this.row.data.edu && this.row.data.edu.school
    },
    fobTitle() {
      return {
        1: 'Очная',
        2: 'Заочная',
      }
    },
    fobs() {

    }
  }
}
</script>

<style lang="scss" scoped>



</style>
