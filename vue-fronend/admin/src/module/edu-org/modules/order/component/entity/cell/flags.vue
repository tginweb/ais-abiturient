<template>

  <div class="">


    <q-markup-table dense flat bordered class="s-font-2xs full-width text-center" wrap-cells v-if="row.anket.entrance.achievements.length">
      <thead>

      <tr>
        <th class="bg-blue-grey-5 text-white" rowspan="2">
          Наимен
        </th>
        <th class="bg-grey-3 ">
          Статус
        </th>
        <th class="bg-grey-3 ">
          Балл
        </th>
      </tr>

      </thead>
      <tbody>
      <tr v-for="achievement of row.anket.entrance.achievements">
        <td>
          <div style="max-width: 160px; max-height: 100px;overflow:hidden; white-space: nowrap;">{{
              achievement.achievementTypeDoc.name
            }}
          </div>
        </td>
        <td>
          {{achievement.status && achievement.status.title}}
        </td>
        <th>
          {{achievement.ball}}
        </th>
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

td {
  white-space: normal;
}

</style>
