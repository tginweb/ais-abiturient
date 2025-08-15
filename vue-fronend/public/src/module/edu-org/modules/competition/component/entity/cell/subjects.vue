<template>

  <div class="q-gutter-sm">


    <q-markup-table
      class="c-subjects "
      flat
      bordered
      dense

    >
      <thead>
      <tr class="text-left">
        <th class="dense">Предмет</th>
        <th class="dense">Проиоритет</th>
        <th class="dense">Мин балл</th>
      </tr>
      </thead>
      <tbody>
      <tr
        class="__item"
        v-for="subject of items"
        :key="subject.csubject"
      >
        <td class="dense">{{subject.subject.name}}</td>
        <td class="dense">{{subject.number}}</td>
        <td class="dense">{{subject.minimal}}</td>
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
    computed: {
      items() {
        return [...this.row.subjects].sort((a, b) => {
          if (a.number > b.number) {
            return 1;
          }
          if (a.number < b.number) {
            return -1;
          }
          return 0;
        });
      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
