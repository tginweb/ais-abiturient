<template>
  <q-page class="q-mt-lg q-mb-xl">

    <CLayout v-if="element">

      <template v-slot:header>
        <el-page-header :back="false" :path="breadcrumbs" title=""/>
      </template>

      <template v-slot:default>

        <catalog-product-element-detail
          :item="element"
        />

        <q-no-ssr>
          <c-products-viewed
            class="q-mt-xl"
          />
        </q-no-ssr>

      </template>
    </CLayout>

  </q-page>
</template>

<script>
import CLayout from '~app/layout/site/page/1cols'
import setPageData from "@tgin/main/router/lib/set-page-data";
import MRoute from "@tgin/main/router/mixin/route-public";
import CProductsViewed from "../component/chunk/products-viewed";

export const loadPageData = async (pageData, ctx) => {

  try {

    const filter = {
      CODE: {eq: ctx.route.params.element},
    }

    if (ctx.route.params.sectionId) {
      filter.SECTION_ID = {eq: ctx.route.params.sectionId}
    } else if (ctx.route.params.sectionCode) {
      filter.SECTION_CODE = {eq: ctx.route.params.sectionCode}
    } else if (ctx.route.params.sectionPath) {
      filter.SECTION_CODE_PATH = {eq: ctx.route.params.sectionPath}
    }

    if (ctx.route.params.elementCode) {
      filter.CODE = {eq: ctx.route.params.elementCode}
    } else if (ctx.route.params.elementId) {
      filter.ID = {eq: ctx.route.params.elementId}
    }

    let {data} = await ctx.apolloClient.query({
      query: require('../../core/gql/product/query/productElement.gql'),
      variables: {
        filter: filter,
        priceInclude: true,
        pathInclude: true
      },
      fetchPolicy: 'no-cache',
      error: (error) => {
        console.log('fff')
        this.$bus.emit('processMessages', this.$util.graphql.exceptionToMessages(error))
      }
    })

    pageData.entity = data.res

    if (!pageData.entity)
      ctx.redirect('/404')

  } catch (e) {

    console.log(e)
  }

  return pageData;
}

export default {
  mixins: [MRoute],
  components: {
    CLayout,
    CProductsViewed
  },
  props: {
    iblock: {},

  },
  apollo: {},
  data() {
    return {
      page: {
        title: 'Элемент'
      },
      queries: {},
    }
  },
  created() {

  },
  computed: {

    element() {
      return this.pageData.entity
    },

    breadcrumbs() {

      let path = [
        {
          label: 'Каталог',
          url: this.$app.getRouteByName('catalog.' + this.iblock + '.index', 'path')
        },
      ]

      if (this.element.PATH) {
        path = [...path, ...this.element.PATH.map(item => ({label: item.NAME, url: item.URL}))]
      }
      return path
    },
  },
  watch: {},
  methods: {},
  async preFetch(ctx) {
    return setPageData('static', ctx, loadPageData)
  }
}
</script>
<style lang="scss" scoped>

</style>
