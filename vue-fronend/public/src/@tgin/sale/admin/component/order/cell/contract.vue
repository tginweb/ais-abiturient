<template>

  <div class="q-gutter-sm s-font-xs">

    <div v-if="row.PROPS_BY_CODE.CONTRACT_NUM.VALUE">
      <b>Договор:</b> {{row.PROPS_BY_CODE.CONTRACT_NUM.VALUE}}
    </div>

    <div v-if="row.PROPS_BY_CODE.EDU_GROUP_NUM.VALUE">
      <b>Группа:</b> {{row.PROPS_BY_CODE.EDU_GROUP_NUM.VALUE}}
    </div>

    <div v-if="row.PROPS_BY_CODE.STUDENT_FIO.VALUE">
      <b>Студент:</b> {{row.PROPS_BY_CODE.STUDENT_FIO.VALUE}}
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
