<template>
  <q-page class="q-mt-lg q-mb-xl">

    <CLayout v-if="queries.sections.result">

      <template v-slot:header>
        <el-page-header
            :path="breadcrumbs"
            :title="pageTitle"
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
          >
            {{ item.label }}
          </router-link>
        </div>

        <div
            v-for="(section,index) of queries.sections.result"
            :key="index"
            class="c-section q-mb-xl"
        >
          <div class="c-section__header q-pb-lg flex items-center">

            <div class="flex font-tenor-sans">
              <h2 class="s-font-xl s-font-xs-3xl leading-normal q-ma-none">
                <router-link :to="section.URL">
                  {{ section.NAME }}
                </router-link>
              </h2>
              <router-link :to="section.URL" class="block text-grey-5 s-font-3xl q-pl-md">
                {{ section.ELEMENT_CNT }}
              </router-link>
            </div>

            <div class="q-ml-auto">
              <router-link :to="section.URL">
                <span class="q-mr-md">Посмотреть все</span>
                <q-icon :name="$icons.chevronRight"/>
              </router-link>
            </div>

          </div>

          <div class="c-section__items">

            <ui-items-grid
                :item="{
                  is: 'catalog-product-element-card',
                  class: 'col-12 col-lg-6',
                  elements: {

                  }
                }"
                :items="section.ELEMENTS"
                class="c-items expand-block-md"
                rowClass=""
            />

          </div>

        </div>

      </template>
    </CLayout>

  </q-page>
</template>

<script>
import CLayout from '~app/layout/site/page/1cols'
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info"
import MRoute from "@tgin/main/router/mixin/route-public"

export default {
  name: 'page.catalog',
  mixins: [MRoute],
  components: {
    CLayout,
  },
  apollo: {
    sections: generateQueryInfo('sections', require('../../core/gql/product/query/productSections.gql')),
  },
  data() {
    return {
      page: {
        title: 'Каталог',
        metaTitle: '',
        description: '',
      },
      queries: {
        sections: {
          vars: {
            where: {
              ACTIVE: 'Y',
              CNT_ACTIVE: 'Y',
              ROOT: true,
              WITH_ELEMENT_COUNT: true
            },
            elementsInclude: true,
            elementsNav: {limit: 4},
            elementsWhere: {INCLUDE_SUBSECTIONS: true}
          },
          state: {
            isLoading: false
          },
          result: null
        },
      },
    }
  },
  watch: {
    sections(v) {

    }
  },
  computed: {
    menu() {
      let result = this.$store.getters['menu/menusItems']['catalog']
      return result.map(item => ({
        selected: item.url === this.$route.path,
        ...item,
      }))
    },
    breadcrumbs() {
      return [
        {label: 'Каталог', url: this.$app.getRouteByName(this.$route.name, 'path')},
      ]
    }
  },

}
</script>
<style lang="scss" scoped>

.items {
  /deep/ .i-wrap {
    padding-left: 30px !important;
    padding-right: 30px !important;
  }
}

</style>
