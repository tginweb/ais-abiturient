<template>

  <div>


    <div class="q-gutter-y-md">

      <div
        v-for="(order, index) of appsAis"
      >

        <div v-if="order.state!==8">

          <div class="text-weight-bold">Заявление АИС № {{ order.id }}</div>

          <div class="">
            <span class="text-grey-6">Состояние:</span> {{ orderStateName(order.state) }}
          </div>

          <div class="q-mt-md q-mr-md">
            <table cellspacing="0" class="s-table-data dense text-left bg-white shadow-1" v-if="false">
              <thead>
              <tr>
                <td>П</td>
                <td>Напр</td>
                <td>Основа</td>
                <td>Cогласие</td>

              </tr>
              </thead>
              <tbody>
              <tr
                v-for="app of order.apps"
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

                  <div v-if="app.agreement" style="white-space: nowrap;"><q-icon name="far fa-check-circle" color="green"/> согласие</div>

                </td>

              </tr>
              </tbody>
            </table>

          </div>

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
  methods: {

    orderStateName(id) {

      const data = {
        1: 'студент',
        2: 'абитуриент',
        3: 'ошибочный ввод',
        4: 'кандидат',
        5: 'в академ. отпуске',
        6: 'задолжник',
        7: 'передача документов',
        8: 'удален',
        9: 'провалил вступительные экзамены',
        10: 'магистрант',
        11: 'переведен',
        12: 'защитился',
        13: 'отчислен',
        14: 'зачислен',
        15: 'допущен к занятиям',
        16: 'умер',
        17: 'старые',
        18: 'слушатель',
        19: 'не поступил',

        20: 'забрал документы',
        21: 'аспирант',
        22: 'докторант',
        23: 'соискатель',
        24: 'выпущен',

        25: 'поступающий',
        26: 'удален в архив',
        27: 'выпущен',
      }

      return data[id]
    }

  },
  computed: {
    appsAis() {
      return this.row.appsAis
    }
  }
}
</script>

<style lang="scss" scoped>

.deleted, .deleted td {
  color: #d97d89 !important;
}

</style>
