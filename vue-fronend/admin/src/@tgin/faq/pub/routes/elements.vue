<template>
  <component
      v-bind="pageViewBind"
      :title="pageTitle"
  >
    <ui-query
        :queryHandler="()=>$apollo.queries.elements"
        :queryResult.sync="queryResult"
        :queryState.sync="queryState"
        :queryVars="queryVars"
        :pagerInfinity="true"
        :minHeightEnable="true"
    >
      <template v-slot:default="{items, onNavMore}">
        <ui-items-grid
            :item="{
            is: 'promo-entity-card',
            class: 'col-24 col-md-12',
          }"
            :items="items"
            class="c-items"
            rowClass="q-col-gutter-lg"
        />
      </template>
    </ui-query>

  </component>
</template>

<script>
import MRoute from "@tgin/main/router/mixin/route-public"
import MRouteNav from "@tgin/main/router/mixin/route-nav"
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info"

export default {
  mixins: [MRoute, MRouteNav],
  components: {},
  props: {
    sectionCode: {},
    sectionId: {},
  },
  apollo: {
    elements: generateQueryInfo('elements', require('../../core/gql/query/elements.gql'), {}, {
      varPath: 'queryVars',
      resPath: 'queryResult',
      statePath: 'queryState',
    }),
  },
  data() {
    return {
      queryResult: null,
      queryState: {
        isLoading: false,
        skip: false
      },
    }
  },
  computed: {

    queryVars() {

      const filter = {}

      if (this.sectionCode)
        filter.SECTION_CODE = {eq: this.sectionCode}
      if (this.sectionId)
        filter.SECTION_ID = {eq: this.sectionId}

      return {
        filter: filter,
        nav: {
          ...this.routeNav,
          limit: 6
        }
      }
    }
  },
}
</script>
<style lang="scss" scoped>


</style>
