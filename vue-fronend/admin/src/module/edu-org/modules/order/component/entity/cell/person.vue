<template>

  <div>

    <div class="q-mb-sm">
      <span class="relative-position cursor-pointer s-link" @click="onRowOpen(row)" style="font-weight: bold;">
        {{ [personal.lastName, personal.firstName, personal.secondName].join(' ') }}
      </span>
    </div>

    <div v-if="row.anket.personal.snils" class="q-mt-sm text-no-wrap">
      СНИЛС: {{ row.anket.personal.snils }}
    </div>
    <div v-else class="q-mt-sm text-no-wrap">
      ПАСПОРТ: {{ row.anket.personal.doc.serial }} {{ row.anket.personal.doc.number }}
    </div>

    <div v-if="row.citizenTypeName" class="q-mt-sm">

      <q-badge color="green-4" v-if="row.anket.personal.citizenship !== 'russia'">
        {{row.citizenTypeName}}
      </q-badge>

      <div class="" v-else>
        {{row.citizenTypeName}}
      </div>

    </div>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
    onRowOpen: {}
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
