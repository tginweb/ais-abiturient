<template>

  <div class="q-gutter-sm">

    <q-markup-table
        v-if="row.tests"
        bordered
        class="c-subjects "
        dense
        flat
    >
      <thead>
      <tr class="text-left">
        <th class="dense bg-blue-grey-5 text-white ">Предмет</th>
        <th class="dense bg-blue-grey-5 text-white">Оценка</th>
      </tr>
      </thead>
      <tbody>

      <tr
          v-for="item in row.tests"
          class="__item"
      >
        <td class="__item__label dense">
          {{ item.subject.name }}
        </td>
        <td class="__item__result">
          {{ item.resultBall || item.abitEgeBall }}
        </td>
      </tr>
      </tbody>
    </q-markup-table>

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
