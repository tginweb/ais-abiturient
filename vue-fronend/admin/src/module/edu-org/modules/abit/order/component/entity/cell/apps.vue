<template>

  <div>

    <q-markup-table dense flat bordered class="s-font-2xs full-width text-center" v-if="row.applications.items.length">
      <thead>
        <tr>
          <th class="" rowspan="2" class="bg-blue-grey-5 text-white">
            Набор
          </th>
          <th class="" rowspan="2" class="bg-blue-grey-5 text-white">
            Конкурс
          </th>
          <th class="bg-grey-4" >
            ЛК
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app of row.applications.items.filter(app => !app.deleted)">

          <td>{{ app.admission.name }}</td>
          <td>{{ app.source.nameShort }}</td>

          <td>+</td>

          <td v-if="false">2. отозвано</td>

          <td v-if="false">3. ыыы</td>

        </tr>
      </tbody>
    </q-markup-table>

    <div class="q-mt-md" v-if="row.institute">
      {{row.institute && row.institute.name}}
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
