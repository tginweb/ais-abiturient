<template>

    <q-dialog
      maximized
      position="top"
      v-model="visible"
      content-class="--notop"
      @hide="$store.dispatch('router/vrouterClose')"
    >

      <div ref="dailogContent" style="width: 1200px; max-width: 100vw; background: transparent;box-shadow:none;">

        <div class="flex bg-white items-center q-px-sm" style="position:fixed; top:0; left:0; width: 100%; z-index:1000; border-bottom: 1px solid #EFEEEE;">

          <div class="col-grow">

            <q-select
              :options="[]"
              bg-color="white"
              class="c-search"
              color="dark"
              borderless
              fill-input
              hide-dropdown-icon
              hide-selected
              input-debounce="1000"
              placeholder="Поиск по товарам"
              use-input
              v-model="queryModelSelected"
              @input-value="onInputValue"
              autofocus
              id="search-input"
            >
              <template v-slot:prepend>
                <q-icon name="search" size="24px"/>
              </template>
            </q-select>

          </div>

          <div class="">
            <q-btn dense flat icon="close" round size="14px" style="z-index: 1000;" v-close-popup/>
          </div>

        </div>

        <div
          class="bg-white"
          style="padding-top: 55px"
          v-if="queries.list.result"
        >
          <div class="q-py-md q-px-sm leading-none s-font-3xs" style="border-bottom1: 1px solid #EFEEEE; color: #9B9895;">
            Найдено {{queries.list.result.info.total}} товаров
          </div>

          <div style="margin-left: 2px; margin-right: 2px; overflow: hidden;">

            <ui-items-grid
              :item="{
              is: 'product-element-card',
              class: 'col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6',
              elements: {

              }
            }"
              :items="queries.list.result.nodes"
              class="c-items"
              rowClass=""
              style="margin-left: -2px; margin-right: -2px"
            />

            <q-btn
              :to="'/catalog/search/?text=' + queryModelSelected"
              class="full-width q-py-sm"
              color="primary"
              label="показать все результаты"
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
      list: generateQueryInfo('list', require('../../../core/gql/product/query/productElements.gql'), {
        skip: true,
      }, {
        varPath: 'cqueries.list.vars',
      }),
    },
    components: {},
    data() {
      return {
        visible: true,
        dialogModule: 'app',
        dialogName: 'search',
        queryModel: '',
        queryModelSelected: '',

        query: '',
        queryDebounce: null,

        queries: {
          list: {
            result: null,
            state: {isLoading: false, mode: null},
          },
        },

        sortBy: 'post_date'
      }
    },
    computed: {
      cqueries() {
        return {
          list: {
            vars: {
              where: {
                SEARCH: this.query
              },
              nav: {
                limit: 20,
              },
              imageSize: 'm1.78'
            },
          },
        }
      },

      nodes() {

        const highlightsById = this.queries.list.result.pageInfo.highlights.reduce((map, item) => (map[item._id] = item, map), {});

        return this.queries.list.result.nodes.map((node) => {
          return {
            ...node,
            highlight: highlightsById[node._id].fragments
          }
        })
      }
    },
    created() {

      this.queryDebounce = this.$util.base.debounce(() => {

        this.query = this.queryModel

        this.queries.list.state.mode = null

        if (!this.query) {
          this.queries.list.result = null
          this.$apollo.queries.list.skip = true
        } else {
          this.$apollo.queries.list.skip = false
        }

      }, 1000)
    },
    mounted() {

    },
    methods: {
      onInputValue(val) {
        this.queryModelSelected = val
        this.queryModel = val
      }
    },
    watch: {
      visible(val) {

          setTimeout(() => {

             const el = document.getElementById('search-input');

             if (el) {
               el.focus()
             }

          }, 500)

      },
      queryModel() {
        this.queryDebounce()
      }
    },
  }

</script>

<style lang="scss">


.q-dialog.--notop {
  z-index: 300;
}

</style>
