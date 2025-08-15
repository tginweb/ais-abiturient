<template>

  <div class="">


    <q-markup-table dense flat bordered class="s-font-2xs full-width text-center" wrap-cells v-if="row.anket.entrance.achievements.length">
      <thead>

      <tr>
        <th class="bg-blue-grey-5 text-white" rowspan="2">
          Наимен
        </th>
        <th class="bg-grey-3 ">
          ЛК
        </th>
        <th class="bg-grey-3 " v-if="false">
          АИС
        </th>
        <th class="bg-grey-3 " v-if="false">
          ЕПГУ
        </th>
      </tr>

      </thead>
      <tbody>
      <tr v-for="achievements of row.anket.entrance.achievements">
        <td>
          <div style="max-width: 160px; max-height: 100px;overflow:hidden;">ИД {{
              achievements.achievementTypeDoc.name
            }}
          </div>
        </td>
        <td>+</td>
        <td v-if="false"> +</td>
        <td v-if="false"></td>
      </tr>
      <tr v-for="quota of row.anket.benefits.quotes">
        <td>
          <div style="max-width: 160px; max-height: 100px;overflow:hidden;">

            ЛЬГОТА
            {{ $store.getters['edu_quotaType/byId'][quota.quotaType] && $store.getters['edu_quotaType/byId'][quota.quotaType].name }}
          </div>
        </td>
        <td> +</td>
        <td v-if="false"> +</td>
        <td v-if="false"></td>
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
