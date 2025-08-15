<template>
  <component
      v-bind="pageViewBind"
      :title="pageTitle"
      :titleShow="false"
      :breadcrumbs="breadcrumbs"
      v-if="queryResult"
  >
    <post-entity-detail :item="queryResult"/>
  </component>
</template>

<script>
import MRoute from "@tgin/main/router/mixin/route-public"
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info"

export default {
  mixins: [MRoute],
  components: {},
  apollo: {
    element: generateQueryInfo('element', require('../../core/gql/query/post_element.gql'), {}, {
      varPath: 'queryVars',
      resPath: 'queryResult',
      statePath: 'queryState',
    }),
  },
  props: {
    sectionCode: {},
    sectionPath: {},
    sectionId: {},
    elementCode: {},
    elementId: {},
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
      const filter = {}

      if (this.elementCode)
        filter.CODE = {eq: this.elementCode}
      if (this.elementId)
        filter.ID = {eq: this.elementId}

      return {
        filter: filter
      }
    },
    breadcrumbs() {
      return this.$app.applyFilters('breadcrumbs', [
        {
          label: 'Записи',
          url: this.$app.getRouteByName('post.elements', 'path')
        },
        {
          label: this.queryResult.NAME,
          url: this.queryResult.URL
        }
      ], this.queryResult, 'post.element')
    }
  },
}
</script>
<style lang="scss" scoped>


</style>
