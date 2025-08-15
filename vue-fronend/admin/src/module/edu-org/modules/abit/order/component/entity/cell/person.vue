<template>

  <div>

    <div class="text-weight-bold relative-position">
      {{ [personal.lastName, personal.firstName, personal.secondName].join(' ') }}
    </div>

    <div class="q-mt-xs text-grey-9 text-no-wrap">
      <span class="text-red-8">{{row.orderType && row.orderType.nameShort}}</span> / № {{ row.nid }}
    </div>

    <div class="q-mt-xs text-grey-7 text-no-wrap" v-if="row.anket.personal.snils">
      СНИЛС: {{ row.anket.personal.snils }}
    </div>

    <div class="q-mt-xs text-grey-7" v-if="row.anket.personal.citizenship==='other'">

      <q-badge color="green-5" title="Иностранец">
        ИНОСТРАНЕЦ
      </q-badge>

      {{ $store.getters['edu_country/byId'][row.anket.personal.country] && $store.getters['edu_country/byId'][row.anket.personal.country].name }}
    </div>

    <div class="q-mt-xs text-grey-7 text-no-wrap" v-if="false">
      Создан: {{ $util.date.timestampToFormat(row.updateAt, 'DD MMMM') }}
    </div>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {
    personal() {
      return this.row.anket.personal
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
