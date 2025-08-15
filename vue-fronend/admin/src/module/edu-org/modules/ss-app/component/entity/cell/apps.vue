<template>

  <div>

    <q-markup-table
        bordered
        class="s-font-2xs full-width text-center"
        dense
        flat
    >
      <thead>
      <tr>
        <th class="bg-blue-grey-5 text-white">
          ПР
        </th>
        <th class="bg-blue-grey-5 text-white">
          Конкурс
        </th>
        <th class="bg-blue-grey-5 text-white">
          Статус
        </th>
      </tr>

      </thead>
      <tbody>
      <tr v-for="app of ([...row.apps].sort((a, b) => ((a.priority > b.priority) ? 1 : -1)) || [])">

        <td>
          {{ app.priority }}
        </td>

        <td>{{ $util.base.deepGet(app, 'competition.name') }}</td>

        <td>{{ $util.base.deepGet(app, 'status.title') }}</td>

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

.deleted, .deleted td {
  color: #d97d89 !important;
}

</style>
