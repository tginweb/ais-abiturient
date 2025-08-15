<template>


    <div class="q-gutter-y-md">

      <table cellspacing="0" class="s-table-data dense text-left bg-white shadow-1">
        <thead>
        <tr>
          <td>П</td>
          <td>Напр</td>
          <td>Основа</td>
          <td>Статус</td>
          <td>Конкурс</td>
          <td>Удалено</td>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="app of row.apps"
            :key="app._id"

        >
          <td class="" style="">
            {{ app.ord }}
          </td>
          <td class="" style="width: 80px;">
            {{ app.admission.name }}
          </td>
          <td class="" style="color:#989898;font-size: 13px;">
            {{ app.source.nameShort }}
          </td>
          <td class="" style="font-size: 13px;">
            {{ app.statusName }}
          </td>
          <td>
            {{app.competition && app.competition.name}}
          </td>
          <td>

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

.deleted, .deleted td {
  color: #d97d89 !important;
}

</style>
