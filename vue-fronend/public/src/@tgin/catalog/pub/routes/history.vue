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
        >
          <template v-slot:default="{items, onNavMore}">

            <ui-items-grid
                v-if="items"
                :item="{
                  is: 'catalog-product-element-card',
                  class: 'col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6',
                  elements: {}
                }"
                :items="items"
                class="c-items expand-block-md"
                rowClass=""
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
import MRoute from "@tgin/main/router/mixin/route-public";

export default {
  name: 'page.history',
  mixins: [MRoute],
  components: {
    CLayout,
  },
  apollo: {
    elements: generateQueryInfo(
        'elements',
        require('../../core/gql/product/query/productElements.gql'),
        {},
        {varPath: 'elementsQueryVars'}
    ),
  },
  data() {
    return {
      navLoading: false,
      navTimeout: null,
      page: {
        title: 'История просмотра'
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

    routeBase() {
      return this.$route.path
    },

    breadcrumbs() {
      let path = [
        {label: 'История просмотров', url: '/history'},
      ]
      return path
    },
    elementsQueryVars() {

      let filter = {
        IN_VIEWED: true
      }

      return {
        nocache: true,
        filter: filter,
        nav: {
          ...this.routeNav,
          limit: 50
        }
      }
    }
  },
  watch: {
    section(val) {
      // this.queries.elements.state.skip = !val
    },
    'routeUrl': {
      handler: function (nav) {
        history.pushState({}, '', this.routeUrl)
      },
      deep: true
    },

    '$store.state.favorites.favoritesIds'() {
      this.$apollo.queries.elements.refetch();
    }
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
