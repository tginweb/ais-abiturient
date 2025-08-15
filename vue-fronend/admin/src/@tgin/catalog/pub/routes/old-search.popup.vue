<template>

  <q-dialog
      maximized
      position="top"
      v-model="visible"
      content-class="--notop"
      @hide="$store.dispatch('router/vrouterClose')"
  >

    <div
        ref="dailogContent"
        style="width: 1200px; max-width: 100vw; background: transparent;box-shadow:none;"
    >

      <div
          class="bg-white q-px-md q-py-md full-width bg-white"
          style="position:sticky; top: 0; z-index:20;"
      >

        <div class="flex items-center q-mb-md">

          <div class="col-grow">

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

          <div class="">
            <q-btn dense flat icon="close" round size="14px" style="z-index: 1000;" v-close-popup/>
          </div>

        </div>

        <div v-if="focus && historyItems.length && !queryModelSelected" class="c-history bg-white">

          <div class="flex s-font-2xs q-pt-md q-pb-sm q-px-md items-center">
            <div class="">
              История запросов
            </div>
            <div class="q-ml-auto">
              <span class="text-primary cursor-pointer" @click="clearHistory">очистить</span>
            </div>
          </div>

          <div
              v-for="(item, index) of historyItems"
              :key="index"
              class="q-py-sm q-px-md text-primary-brown-gray-4 cursor-pointer"
              @click="onSelectHistory(item)"
          >
            {{ item }}
          </div>

        </div>

        <div class="c-suggetstions">

          <q-chip outline color="primary" text-color="white" @click.native="chipSearch('филадельфия')">
            филадельфия
          </q-chip>

          <q-chip outline color="primary" text-color="white" @click.native="chipSearch('канада')">
            канада
          </q-chip>

          <q-chip outline color="primary" text-color="white" @click.native="chipSearch('с лососем')">
            с лососем
          </q-chip>

          <q-chip outline color="primary" text-color="white" @click.native="chipSearch('с семгой')">
            с семгой
          </q-chip>

          <q-chip outline color="primary" text-color="white" @click.native="chipSearch('с тунцом')">
            с тунцом
          </q-chip>

          <q-chip outline color="primary" text-color="white" @click.native="chipSearch('с курицей')">
            с курицей
          </q-chip>

        </div>



      </div>

      <div
          class="bg-white"
          v-if="query && resultElements"
      >
        <div style="margin-left: 2px; margin-right: 2px; overflow: hidden;">

          <ui-items-grid
              :item="{
                is: 'catalog-product-element-card',
                class: 'col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6',
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

    </div>

  </q-dialog>

</template>

<script>


import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";

export default {
  props: {
    model: {}
  },
  apollo: {
    list: generateQueryInfo('list', require('../gql/query/search.gql'), {skip: true}),
  },
  components: {},
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

<style lang="scss">


.q-dialog.--notop {
  z-index: 300;
}

</style>
