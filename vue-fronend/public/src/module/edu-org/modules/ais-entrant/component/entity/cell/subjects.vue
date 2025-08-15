<template>
  <div class="q-gutter-y-sm">

    <table
        cellspacing="0"
        class="s-table-data dense text-left bg-white shadow-1"
    >
      <thead>
      <tr>
        <td>Предмет</td>
        <td>Способ сдачи</td>
        <td>Оценка</td>
        <td></td>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(subject, index) of row.subjects"
          :key="index"
      >
        <td class="">
          {{subject.csubject}} {{ subject.subject &&  subject.subject.name }}
        </td>
        <td class="">
          {{ subject.cresultSourceType }}
        </td>
        <td class="">
          {{ subject.mark }}
        </td>
      </tr>
      </tbody>
    </table>


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
