<template>
  <q-page class="q-mt-lg q-mb-xl">

    <CLayout v-if="queries.elements.result">

      <template v-slot:header>
        <el-page-header :back="false" :path="breadcrumbs" :title="pageTitle"/>
      </template>

      <template v-slot:default>

        <ui-query
          :minHeightEnable="true"
          :pagerInfinity="true"
          :queryHandler="()=>$apollo.queries.elements"
          :queryResult.sync="queries.elements.result"
          :queryState.sync="queries.elements.state"
          :queryVars="elementsQueryVars"
          style="max-width:750px;"
        >
          <template v-slot:default="{items, onNavMore}">

            <review-entity-product
              v-for="item of items"
              :key="item.ID"
              :colProductEnable="true"
              :item="item"
              class="q-py-lg border-b-1 border-primary-brown-gray-1"
              colImageClass="col-2 q-mr-2md"
            />

          </template>
        </ui-query>

      </template>

    </CLayout>

  </q-page>
</template>

<script>
import CLayout from '~app/layout/site/page/1cols'
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";
import MRoute from "~app/mixin/route-public";

export default {
  name: 'page.favs',
  mixins: [MRoute],
  components: {
    CLayout,
  },
  apollo: {
    elements: generateQueryInfo('elements', require('../gql/query/recordset.gql'), {}, {
      varPath: 'elementsQueryVars'
    }),
  },
  data() {
    return {
      navLoading: false,
      navTimeout: null,
      page: {
        title: 'Отзывы'
      },
      queries: {
        elements: {
          state: {
            isLoading: false,
            skip: false
          },
          result: null
        },
      },
    }
  },
  created() {

  },
  computed: {

    searchText() {
      return this.$route.query.text
    },

    routeBase() {
      return this.$route.path
    },

    breadcrumbs() {
      let path = [
        {label: 'Отзывы', url: '/reviews/product'},
      ]
      return path
    },
    elementsQueryVars() {

      let filter = {
        TARGET: 'product'
      }

      return {
        filter: filter,
        elementInclude: true,
        nav: {
          ...this.routeNav,
          limit: 100
        }
      }
    }
  },
  watch: {
    'routeUrl': {
      handler: function (nav) {
        history.pushState({}, '', this.routeUrl)
      },
      deep: true
    },
  },
  methods: {
    onSortModeClick(sortMode) {
      if (this.routeNav.sort !== sortMode.value) {
        this.routeNav.sort = sortMode.value
        this.routeNav.asc = sortMode.asc
      } else {
        this.routeNav.asc = !this.routeNav.asc
      }
      this.routeNav.page = 1
    }
  },
}
</script>
<style lang="scss" scoped>


</style>
