<template>
  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      @hide="onHide"
      dialog-width="1150px"
      title="Поиск"
  >

    <template v-slot:header>

      <div class="q-px-md q-px-md-lg q-mt-md-md q-mb-md q-mb-md-none">
        <q-select
            ref="input"
            :options="[]"
            bg-color="white"
            class="c-search"
            color="dark"
            borderless
            fill-input
            hide-dropdown-icon
            hide-selected
            input-debounce="1000"
            placeholder="Поиск по товарам "
            use-input
            v-model="query"
            @focus="onFocus"
            @input-value="onInputValue"
            autofocus
            outlined
            id="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" size="24px"/>
          </template>

          <template v-slot:append>
            <div class="s-font-sm" style="color: #9B9895;" v-if="query">
              Найдено {{ resultElements.length }} товаров
            </div>
          </template>
        </q-select>
      </div>

    </template>


    <template v-slot:default>

      <div
          class="bg-white"
          v-if="query && resultElements"
      >
        <div style="margin-left: 2px; margin-right: 2px; overflow: hidden;">

          <ui-items-grid
              :item="{
                is: 'catalog-product-element-card',
                class: 'col-24 col-sm-24 col-md-12 col-lg-8 col-xl-6',
                elements: {

                }
              }"
              :items="resultElements"
              class="c-items"
              rowClass=""
              style="margin-left: -2px; margin-right: -2px"
          />

          <q-btn
              :to="'/catalog/search/?text=' + query"
              class="full-width q-py-sm"
              color="primary"
              label="показать все результаты"
              v-if="false"
          />

        </div>


      </div>

    </template>

  </component>
</template>

<script>

import MVRoute from '@tgin/main/router/mixin/vroute'
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";

export default {
  mixins: [MVRoute],
  apollo: {
    list: generateQueryInfo('list', require('../gql/query/search.gql'), {skip: true}),
  },
  props: {
    onSuccess: {}
  },
  data() {
    return {
      visible: true,
      dialogModule: 'app',
      dialogName: 'search',
      query: '',
      historyItems: [],
      queryDebounce: null,

      queries: {
        list: {
          result: null,
          state: {isLoading: false, mode: null},
          vars: {
            query: null
          }
        },
      },
      focus: false,
      sortBy: 'post_date'
    }
  },
  computed: {

    resultElements() {
      return this.queries.list.result && this.queries.list.result.ELEMENTS || []
    },

    resultSections() {
      return this.queries.list.result && this.queries.list.result.SECTIONS || []
    },

  },
  created() {

  },
  mounted() {

  },
  methods: {
    onInputValue(val) {
      this.query = val
    },

    loadHistoryItems() {
      this.historyItems = this.$q.cookies.get('SEARCH_HISTORY_ITEMS') || []
    },
    addHistoryItem(query) {
      if (!query) return
      const items = this.$q.cookies.get('SEARCH_HISTORY_ITEMS') || []
      items.unshift(query)
      items.length = 5
      this.$q.cookies.set('SEARCH_HISTORY_ITEMS', items, {expires: 10})
      this.loadHistoryItems()
    },
    clearHistory() {
      this.$q.cookies.set('SEARCH_HISTORY_ITEMS', [], {expires: 10})
      this.loadHistoryItems()
    },

    onFocus() {
      this.focus = true
    },

    chipSearch(q) {
      this.query = q
    },
  },
  watch: {
    query(query) {
      this.queries.list.vars.query = query
      this.$apollo.queries.list.skip = !query
    },

    visible(val) {

      setTimeout(() => {

        const el = document.getElementById('search-input');

        if (el) {
          el.focus()
        }

      }, 500)

    },
  },
}
</script>
<style lang="scss" scoped>

</style>
