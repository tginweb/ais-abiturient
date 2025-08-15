<template>
  <component
      v-bind="pageViewBind"
      :title="pageTitle"
      :breadcrumbs="breadcrumbs"
      v-if="queryResult"
  >
    <promo-entity-detail :item="queryResult"/>
  </component>
</template>

<script>
import MRoute from "@tgin/main/router/mixin/route-public"
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info"

export default {
  mixins: [MRoute],
  components: {

  },
  apollo: {
    element: generateQueryInfo('element', require('../../core/gql/query/element.gql'), {}, {
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
    routeEntity() {
      return this.queryResult
    },
    queryVars() {
      return {
        where: {CODE: {eq: this.$route.params.element}}
      }
    },
    breadcrumbs() {
      return [
        {label: 'Акции', 'url': this.$app.getRouteByName('promo.elements', 'path')},
        {label: this.queryResult.NAME, 'url': this.queryResult.URL}
      ]
    }
  },
}
</script>
<style lang="scss" scoped>


</style>
