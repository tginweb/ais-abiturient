<template>

  <div>

    <div class="q-gutter-y-md">

      <div
        v-for="(order, index) of row.appsOnline"
        :key="order.nid"
      >
        <router-link class="flex" :to="'/admin/edu/order/' + order.nid + '/view'" style="color:#000;">

          <span class="text-weight-bold" >Заявление № {{ order.nid }}</span>


        </router-link>

        <div class="">
          <span class="text-grey-6">Статус:</span>
          {{order.state.statusInfo.titleAdmin}}
        </div>

        <div class="q-mt-md">

          <table cellspacing="0" class="s-table-data dense text-left bg-white shadow-1">
            <thead>
            <tr>
              <td>П</td>
              <td>Напр</td>
              <td>Основа</td>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="app of order.applications.items"
              :key="app._id"
              :class="{
                'bg-white': true,
                'deleted': app.deleted
              }"
            >
              <td class="" style="">

                {{ !app.deleted && (app.priority<10) ? app.priority : '-' }}

              </td>

              <td class="" style="width: 80px;">
                {{ app.admission.name }}
              </td>
              <td class="" style="color:#989898;font-size: 13px;">
                {{ app.source.nameShort }}
              </td>

            </tr>
            </tbody>
          </table>

        </div>

      </div>

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

.deleted, .deleted td {
  color: #d97d89 !important;
}

</style>
