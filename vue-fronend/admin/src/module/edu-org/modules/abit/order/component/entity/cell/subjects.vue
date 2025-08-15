<template>

  <div class="q-gutter-sm">

    <q-markup-table
      class="c-subjects "
      flat
      bordered
      dense
      v-if="row.anket.entrance.subjects.length"
    >
      <thead>
      <tr class="text-left">
        <th class="dense bg-blue-grey-5 text-white ">Предмет</th>
        <th class="bg-grey-4">ЛК</th>
        <th class="bg-grey-4" v-if="false">АИС</th>
      </tr>
      </thead>
      <tbody>

      <tr
        class="__item"
        v-for="item in row.anket.entrance.subjects"
      >
        <td class="__item__label dense">
          {{item.subjectDoc.name}}
        </td>

        <td class="__item__result">
          <template v-if="item.status=='ready'">
            {{item.score}}
          </template>
        </td>
        <td class="__item__label" v-if="false">

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
