<template>

  <div class="q-gutter-sm">

    <div v-if="row.CONTRACT_NUM">
      <b>Договор:</b> {{row.CONTRACT_NUM}}
    </div>

    <div v-if="row.EDU_GROUP_NUM">
      <b>Группа:</b> {{row.EDU_GROUP_NUM}}
    </div>

    <div v-if="row.STUDENT_FIO">
      <b>Студент</b>: {{row.STUDENT_FIO}}
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
