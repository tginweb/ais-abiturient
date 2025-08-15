<template>

  <div v-if="row.podldocOrg" class="q-gutter-sm q-gutter-sm">

    <div class="text-bold">
      {{ row.podldocOrg }}
    </div>
    <div class="">
      {{ row.podldocOrgTransferType === 1 ? 'онлайн ЕПГУ' : 'печатный оригинал' }}
    </div>
    <div class="">
      {{ $util.date.timestampToFormat(row.podldocOrgTransferDate, 'DD MMMM HH:mm') }}
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
