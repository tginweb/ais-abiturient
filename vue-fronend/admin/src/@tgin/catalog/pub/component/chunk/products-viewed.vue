<template>

  <ui-widget
      v-if="queries.elements.result && queries.elements.result.nodes.length"
      class="q-mb-xl"
      more-label="вся история просмотров"
      more-url="/history"
      title="Вы недавно смотрели"
      header-title-class="s-font-4xl s-font-md-6xl"
  >
    <ui-items-product-slider
        v-if="queries.elements.result"
        :items="queries.elements.result.nodes"
        itemIs="catalog-product-element-card"
    />

  </ui-widget>

</template>

<script>

import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info"

export default {
  props: {},
  apollo: {
    elements: generateQueryInfo(
        'elements',
        require('../../../core/gql/product/query/productElements.gql'),
        {},
        {varPath: 'elementsQueryVars'}
    ),
  },
  data() {
    return {
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
    elementsQueryVars() {
      let filter = {
        IN_VIEWED: true
      }
      return {
        filter: filter,
        nav: {
          limit: 4,
          sort: 'IDS'
        },
        nocache: true
      }
    }
  },
  watch: {},
  methods: {},
}
</script>
<style lang="scss" scoped>


</style>
