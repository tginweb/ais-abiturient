<template>
  <div class="com" ref="com">

    <q-scroll-area
        :style="{
          height: scrollHeight + 'px'
        }"
    >
      <div ref="items">

        <q-resize-observer @resize="onResize"/>

        <div v-if="elementsManual.length">

          <div class="s-font-md q-mb-sm text-weight-bold text-center q-py-sm bg-primary-brown-gray-1">
            Избранные товары
          </div>

          <catalog-product-element-mini
              :item="item"
              :key="item.ID"
              v-for="item in elementsManual"
              class=" q-py-md q-pr-md"
          />

        </div>

        <div v-if="elementsSales.length" class="q-mt-md">

          <div class="s-font-md q-mb-sm text-weight-bold text-center q-py-sm bg-primary-brown-gray-1">
            Часто заказываете
          </div>

          <catalog-product-element-mini
              :item="item"
              :key="item.ID"
              v-for="item in elementsSales"
              class=" q-py-md q-pr-md"
          />

        </div>

      </div>

    </q-scroll-area>
  </div>
</template>

<script>

import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";

export default {
  apollo1: {
    //favorites: generateQueryInfo('favorites', require('../../gql/query/favorites.gql')),
  },
  data() {
    return {
      scrollHeight: 100,
      tab: 'fav',
      queries: {
        favorites: {
          vars: {
          },
          state: {
            isLoading: false
          },
          result: null
        },
      },
    }
  },
  computed: {
    elementsManual() {
      return (this.queries.favorites.result || []).filter(item => item.FAV && (item.FAV.TYPE === 'manual'))
    },
    elementsSales() {
      return (this.queries.favorites.result || []).filter(item => item.FAV && (item.FAV.TYPE === 'sales'))
    },
  },
  methods: {
    onResize() {

      if (this.$refs.items) {

        const rect = this.$refs.com.getBoundingClientRect()

        const itemsTop = parseInt(rect.y)
        const itemsHeight = this.$refs.items.clientHeight
        const windowHeight = window.innerHeight

        const maxHeight = windowHeight - itemsTop - 50;

        let height = itemsHeight > maxHeight ? maxHeight : itemsHeight

        this.scrollHeight = height
      }

    },
  },
  watch: {
    '$q.screen.height'(v) {
      this.onResize()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.onResize()
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
