<template>

  <div class="">

    <div v-for="item of items" class="flex q-gutter-x-sm no-wrap q-mb-xs">

      <div
          class="q-mr-auto1"
          style="max-width: 150px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
          v-html="item.NAME"
      ></div>

      <div class="text-weight-bold " style="white-space: nowrap;">
        x {{ item.QUANTITY }}
        {{ $util.base.deepGet(item, 'ELEMENT.MEASURE.NAME') }}
      </div>

    </div>

    <q-btn
        v-if="row.ITEMS.length>itemsLimit"
        class="q-mt-sm"
        outline
        color="primary"
        size="sm"
        @click.stop="itemsLimit = 100"
    >
      и еще {{ row.ITEMS.length - itemsLimit }}
    </q-btn>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  data() {
    return {
      itemsLimit: 3
    }
  },
  computed: {
    items() {
      return this.row.ITEMS.slice(0, this.itemsLimit)
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
