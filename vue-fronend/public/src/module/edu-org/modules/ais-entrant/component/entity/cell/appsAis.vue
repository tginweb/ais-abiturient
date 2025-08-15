<template>


    <div class="q-gutter-y-md">

      <table cellspacing="0" class="s-table-data dense text-left bg-white shadow-1">
        <thead>
        <tr>
          <td>П</td>
          <td>Напр</td>
          <td>Основа</td>
          <td>CОГЛ<br/>АИС</td>
          <td>Епгу<br/>статус</td>
          <td>Епгу<br/>согл</td>
          <td>Епгу<br/>uid</td>
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

            <div v-if="app.agreement" style="white-space: nowrap;">
              + согласие
            </div>

          </td>
          <td class="" style="font-size: 13px;">

            <div v-if="app.epgu && app.epgu.status">
              {{app.epgu.statusName}}
            </div>

          </td>
          <td>

            {{app.epgu.agreement ? 'согл' : ''}}

          </td>
          <td class="" style="font-size: 13px;">
              {{app.epgu.uid}} -- {{app.epgu.epguUid}}
          </td>
          <td>
              {{app.admission.id}}.{{app.source.id}}
          </td>
          <td>
            <div>{{app.notInAis ? 'не в АИС' : ''}}</div>
            <div>{{app.deleted ? 'удалено' : ''}}</div>
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
