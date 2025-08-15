<template>

  <div class="q-gutter-sm">
    <div v-if="row.podldocEpgu" class="text-green-9">
      ЕПГУ оригинал у нас
      <span v-if="row.podldocEpguRecieved || row.podldocEpguUpdated">
        ({{ $util.date.timestampToFormat(row.podldocEpguRecieved || row.podldocEpguUpdated, 'DD MMM HH:mm') }})
      </span>
    </div>
    <div v-else-if="row.podldocEpguCanceled" class="text-red">
      ЕПГУ оригинал отозван
      <span v-if="row.podldocEpguCanceled">
        ({{ $util.date.timestampToFormat(row.podldocEpguCanceled, 'DD MMM HH:mm') }})
      </span>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {}
}
</script>

<style lang="scss" scoped>


</style>
