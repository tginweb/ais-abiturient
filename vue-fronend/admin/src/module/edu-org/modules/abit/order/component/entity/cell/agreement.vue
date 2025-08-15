<template>

  <div>

    <div
      v-if="row.agreementChangedDate"
      :class="{
        changed: row.agreementChanged
      }"
      class="q-pa-xs"

    >
      {{ $util.date.timestampToFormat(row.agreementChangedDate, 'DD MMMM HH:mm') }}
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


.changed {
  font-weight: bold;
  background-color: #d28400;
  color: #fff;
}

</style>
