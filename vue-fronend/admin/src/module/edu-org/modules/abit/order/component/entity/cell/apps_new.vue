<template>

  <div>

    <q-markup-table dense flat bordered class="s-font-2xs full-width text-center" v-if="apps.length">
      <thead>
      <tr>
        <th class="" rowspan="2" class="bg-blue-grey-5 text-white">
          Набор
        </th>
        <th class="" rowspan="2" class="bg-blue-grey-5 text-white">
          Конкурс
        </th>
        <th class="bg-grey-4">
          ЛК
        </th>
        <th class="bg-grey-4">
          ЕПГУ
        </th>
        <th class="bg-grey-4">
          АИС
        </th>
      </tr>

      </thead>
      <tbody>
      <tr v-for="app of apps.filter(app => !app.deleted)">

        <td>{{ app.admission && app.admission.name }}</td>
        <td>{{ app.source && app.source.nameShort }}</td>

        <td>
          {{ app.priority }}
        </td>

        <td>
          {{ app.epgu && app.epgu.id ? '+' : '' }}
        </td>

        <td>
          {{ app.ais && app.ais.id ? app.priority : '' }}
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
  computed: {
    apps() {
      return this.$util.base.orderBy(this.row.apps, 'priority', 'asc')
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
