<template>
  <q-page class="q-mt-lg q-mb-xl">


    <CLayout v-if="queries.elements.result">

      <template v-slot:header>
        <el-page-header
            :back="true"
            :path="breadcrumbs"
            :title="headerTitle"
            :titleColorClass="titleColorClass"
            :titleStyle="titleStyle"
        />
      </template>

      <template v-slot:default>

        <div class="c-menu q-mb-lg">
          <router-link
              v-for="item of menu"
              :key="item.id"
              :class="{
                 ['text-' + item.color]: item.color,
                'c-menu-item inline-block q-mr-xs q-mb-xs q-px-md q-py-xs bg-primary-brown-1': true,
                'selected': item.selected
              }"
              :to="item.url"
              @click="onNavMenuItem(item)"
          >
            {{ item.label }}
          </router-link>
        </div>

        <div class="c-options row q-col-gutter-y-md items-center q-mb-lg">

          <div class="col-24 col-md-grow  s-font-2xl">
            {{ elementsTotalCount }} {{ elementsTotalCount | pluralize('ru', ['товар', 'товара', 'товаров']) }}
          </div>

          <div class="col-24 col-md-auto  c-sort-modes row q-col-gutter-sm q-col-gutter-md-md   text-right">

            <div
                v-for="(sortMode, index) of sortModes"
                :key="index"
                :class="{
                  selected: sortMode.value === routeNav.sort
                }"
                class="col-24 col-sm-auto c-sort-mode  cursor-pointer no-wrap"
                style=""
                @click="onSortModeClick(sortMode)"
            >
              <div class="c-sort-mode__label inline-block">

                <span class="gt-sm">{{ sortMode.label }}</span>
                <span class="lt-md">{{ sortMode.labelMobile }}</span>

              </div>
              <div
                  v-if="routeNav.sort === sortMode.value"
                  class="c-sort-mode__dir inline-block q-ml-sm"
              >
                <q-icon :name="!routeNav.asc ? $icons.fasChevronDown :  $icons.fasChevronUp"/>
              </div>
            </div>

          </div>

        </div>


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
                  elements: {

                  }
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
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info"
import setPageData from "@tgin/main/router/lib/set-page-data"
import MRoute from "@tgin/main/router/mixin/route-public"
import MRouteNav from "@tgin/main/router/mixin/route-nav"

export const loadPageData = async (pageData, ctx) => {

  try {

    const setCode = ctx.route.params.set

    if (setCode) {

      pageData.mode = 'set'

      const urlSetPattern = ctx.store.$app.getRouteByName(ctx.route.name, 'path') || ''

      const urlSet = urlSetPattern.replace(':set?', setCode)

      let {data} = await ctx.apolloClient.query({
        query: require('@tgin/page/core/gql/query/page_route.gql'),
        variables: {
          URL: urlSet
        },
        fetchPolicy: 'no-cache',
      })

      pageData.page = data.res

    } else {

      pageData.mode = 'section'

      const filter = {
        WITH_ELEMENT_COUNT: true,
        CNT_ACTIVE: 'Y'
      }

      if (ctx.route.params.sectionId) {
        filter.ID = {eq: ctx.route.params.sectionId}
      } else if (ctx.route.params.sectionCode) {
        filter.CODE_PATH = ctx.route.params.sectionCode
      } else if (ctx.route.params.sectionPath) {
        filter.CODE_PATH = ctx.route.params.sectionPath
      }

      let {data} = await ctx.apolloClient.query({
        query: require('../../core/gql/product/query/productSection.gql'),
        variables: {
          filter: filter,
          childrenInclude: true,
          parentsInclude: true,
          parentInclude: true,
          parentChildrenInclude: true
        },
        fetchPolicy: 'no-cache',
      })

      pageData.entity = data.res

      if (!pageData.entity)
        ctx.redirect('/404')
    }

  } catch (e) {

    console.log(e)
  }

  return pageData;
}


export default {
  mixins: [MRoute, MRouteNav],
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
  props: {
    iblock: {},
    sectionPath: {}
  },
  data() {
    return {
      navLoading: false,
      navTimeout: null,
      page: {
        title: 'Секция'
      },
      queries: {
        elements: {
          state: {
            isLoading: false,
            skip: false,
            error: null
          },
          result: null
        },
      },
      sortModes: [
        {label: 'По наименованию', labelMobile: 'По названию', value: 'NAME', asc: false},
        {label: 'По популярности', labelMobile: 'По популярности', value: 'popular', asc: false},
        {label: 'По цене', labelMobile: 'По цене', value: 'price', asc: true}
      ],
      filterSets: {
        new: {
          NAME: 'Новинки',
          WHERE: {'FLAG_CODE': 'NEW'},
        },
        hit: {
          NAME: 'Хиты продаж',
          WHERE: {'FLAG_CODE': 'CHOICE'},
        },
        season: {
          NAME: 'Сезонный товар',
          WHERE: {'FLAG_CODE': 'SEASON'},
        },
        discount: {
          NAME: 'Со скидкой',
          WHERE: {'IS_DISCOUNT': true},
        },
        farm: {
          NAME: 'Фермерский товар',
          WHERE: {'IS_FARM': true},
        },
      }
    }
  },
  created() {

  },
  computed: {

    titleColorClass() {
      return this.section && this.section.CODE === 'novyy_god' ? 'q-px-sm' : ''
    },

    titleStyle() {
      return this.section && this.section.CODE === 'novyy_god' ? 'color:white;background-color:#03aefe;' : ''
    },

    routeBase() {
      return this.$route.path
    },

    filterSet() {
      return {
        ...this.filterSets[this.$route.params.set],
        code: this.$route.params.set
      }
    },

    headerTitle() {
      if (this.section) {
        return this.section.NAME
      } else if (this.filterSet) {
        return this.filterSet.NAME
      } else {
        return 'Каталог'
      }
    },

    pageTitle() {
      if (this.section) {
        return this.section.META && this.section.META.TITLE || this.section.NAME
      } else if (this.filterSet) {
        return this.filterSet.NAME
      } else {
        return 'Каталог'
      }
    },

    pageMetaTitle() {
      if (this.section) {
        return this.section.META && this.section.META.TITLE || this.section.NAME
      } else if (this.pageData.page) {
        return this.pageData.page.META && this.pageData.page.META.TITLE
      } else if (this.filterSet) {
        return this.filterSet.NAME
      } else {
        return 'Каталог'
      }
    },

    pageDescription() {
      if (this.section) {
        return this.section.META && this.section.META.DESCRIPTION
      } else if (this.pageData.page) {
        return this.pageData.page.META && this.pageData.page.META.DESCRIPTION
      }
    },

    pageKeywords() {
      if (this.section) {
        return this.section.META && this.section.META.KEYWORDS
      } else if (this.pageData.page) {
        return this.pageData.page.META && this.pageData.page.META.KEYWORDS
      }
    },

    elementsTotalCount() {
      if (this.section) {
        return this.section.ELEMENT_CNT
      } else {
        return this.queries.elements.result ? this.queries.elements.result.info.total : 0
      }
    },

    menu() {

      let result = []

      if (this.isSectionRoute) {

        let sections = []

        if (this.section) {

          if (this.section.CHILDREN.length) {
            sections = this.section.CHILDREN
          } else {
            if (this.section.PARENT)
              sections = this.section.PARENT.CHILDREN
          }

          result = sections
              .filter(item => item.ELEMENT_CNT > 0)
              .map(item => ({
                id: 's' + item.ID,
                label: item.NAME,
                url: item.UF_REPLACE_LINK || item.URL,
                count: item.ELEMENT_CNT,
                selected: item.ID === this.section.ID,
                sectionCode: !item.UF_REPLACE_LINK ? item.CODE : null,
                sectionId: !item.UF_REPLACE_LINK ? item.ID : null
              }))

          if (result.length) {
            if (this.section.PARENT)
              result.unshift({
                id: 'all',
                label: 'Все',
                url: this.section.PARENT.URL
              })
            else
              result.unshift({
                id: 'all',
                label: 'Все',
                url: this.section.URL
              })
          }
        }

      } else {
        Array.prototype.push.apply(result, this.$store.getters['menu/menusItems']['catalog'])
      }

      return result.map(item => ({
        selected: item.url === this.$route.path,
        ...item,
      }))
    },
    isSectionRoute() {
      return this.pageData.mode === 'section'
    },
    section() {
      return this.pageData.entity;
    },
    breadcrumbs() {

      let path = [
        {
          label: 'Каталог',
          url: this.$app.getRouteByName('catalog.' + this.iblock + '.index', 'path')
        },
      ]

      if (this.section) {
        if (this.section.PARENTS && this.section.PARENTS.length) {
          path = [
            ...path,
            ...this.section.PARENTS.map(item => ({
              label: item.NAME,
              url: item.URL
            }))
          ]
        }
        path.push({
          label: this.section.NAME,
          url: this.section.URL,
        })
      } else if (this.filterSet) {
        path.push({
          label: this.filterSet.NAME,
          url: this.filterSet.URL,
        })
      }

      return path
    },
    elementsQueryVars() {

      let filter = {
        INCLUDE_SUBSECTIONS: true
      }

      let skip = false

      if (this.isSectionRoute) {

        if (this.section && this.section.ID) {
          filter.SECTION_ID = {eq: this.section.ID}
        } else {
          skip = true
        }

      } else {
        if (this.filterSet && this.filterSet.WHERE) {
          filter = {...filter, ...this.filterSet.WHERE}
        } else {
          skip = true
        }
      }

      this.queries.elements.state.skip = skip

      return {
        filter: filter,
        nav: {
          ...this.routeNav,
          limit: 24
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
  },
  methods: {

    onNavMenuItem(item) {
      this.$router.push(item.url)
    },

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

  beforeRouteUpdate(to, from, next) {

    next()
  },
  async preFetch(ctx) {
    return setPageData('static', ctx, loadPageData)
  }
}
</script>
<style lang="scss" scoped>

.items {
  /deep/ .i-wrap {
    padding-left: 30px !important;
    padding-right: 30px !important;
  }
}

.c-sort-mode {

  &.selected {
    font-weight: 600;
  }
}

.c-menu-item {

  &.selected {
    border: 1px solid #444;
  }
}

.item-image {
  width: 35px;
  height: 35px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
}


</style>
