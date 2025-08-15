<template>

  <div class="q-gutter-md">

    <div v-for="entrant of row.aisEntrants" style="white-space:nowrap;">
      {{entrant.id}} - {{entrant.state}} - {{orderStateName(entrant.state)}}
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

  }
}
</script>

<style lang="scss" scoped>

.deleted, .deleted td {
  color: #d97d89 !important;
}

</style>
