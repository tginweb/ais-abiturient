<template>

  <div >

      <div
        v-for="(order, index) of appsWithAchievements"
      >

        <div class="text-weight-bold">Достижения АИС:</div>

        <div class="q-mb-md">
          <span class="text-grey-6">Количество:</span> {{ order.achievements.length }}
        </div>

        <table cellspacing="0" class="s-table-data  dense text-left bg-white shadow-1">
              <thead>
              <tr>
                <td>Наименование</td>
                <td>Балл</td>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="doc of order.achievements"
                :key="doc._id"
                :class="{}"
              >
                <td class="" style="">
                  {{ doc.name }}
                </td>
                <td class="" style="">
                  {{ doc.ball }}
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
  computed: {

    appsWithAchievements() {
      return this.row.appsAis.filter(app => {
        return app.achievements.length > 0
      })
    }
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

  }
}
</script>

<style lang="scss" scoped>

.deleted, .deleted td {
  color: #d97d89 !important;
}

</style>
