<template>

  <div>

    <q-badge color="yellow-8" v-if="row.changedEpgu && false">
      ИЗМЕНЕНО
    </q-badge>


    <div class="text-weight-bold">Заявления на ЕПГУ</div>

    <div class="">
      <span class="text-grey-6">Состояние:</span>
    </div>

    <div class="q-mt-md q-mr-md">

      <table cellspacing="0" class="s-table-data dense text-left bg-white shadow-1">
        <thead>
        <tr>
          <td>Напр</td>
          <td>Основа</td>
          <td>Статус</td>
          <td>Согласие на ЕПГУ</td>
          <td>#</td>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="app of row.appsEpgu"
          :key="app._id"
          :class="{
            'bg-white': true,
            'deleted': [15].indexOf(app.cstatus) > -1,
          }"
        >

          <td class="" style="width: 80px;">
            {{ app.admission.name }}
          </td>
          <td class="" style="color:#989898;font-size: 13px;">
            {{ app.source.nameShort }}
          </td>
          <td class="">
            <span style="white-space: nowrap1;font-size: 13px;">
              {{ app.statusName }}
            </span>
          </td>
          <td class="">

            <div v-if="app.agreement"><q-icon name="far fa-check-circle" color="green"/> согласие {{app.agreementDate}}</div>
            <div v-if="app.deny"><q-icon name="fas fa-ban" color="red"/> отказ {{app.denyDate}}</div>

          </td>
          <td class="">
            {{app.cadmission}}.{{app.csource}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>



  </div>

</template>

<script>
export default {

  props: {
    row: {},
  },
  data() {
    return {

    }
  },
  computed: {

  }
}
</script>

<style lang="scss" scoped>

.deleted, .deleted td {
  color: #d97d89 !important;
}

.rating-good {
  font-weight: 900;
  color: #3f862a;
}

</style>
