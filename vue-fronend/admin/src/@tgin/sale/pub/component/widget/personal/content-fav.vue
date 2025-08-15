<template>
  <div>

    <q-scroll-area
        :style="{
          height: rowSize.height + 'px',
          maxWidth: '100%'
        }"
        visible
        v-if="entitiesComp.length"
    >
      <div>
        <q-resize-observer @resize="rowSize = $event"/>
        <div class="row q-col-gutter-x-md no-wrap" ref="row">

          <div
              class="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2"
              v-for="element in entitiesComp"
              :key="element.ID"
          >
            <router-link :to="element.URL" event="" @click.native="onNav(element)" class="text-center">
              <div>
                <img
                    :src="$image.resolveUrl(element.LIST_IMAGE.SRC, 'r100')"
                    v-if="element.LIST_IMAGE"
                />
              </div>
              <div class="s-font-3xs" v-if="$q.screen.gt.md">
                {{ element.NAME }}
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </q-scroll-area>

    <div v-else>
      нет товаров в избранном
    </div>

  </div>
</template>

<script>

import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info";

export default {
  apollo: {
    favorites: generateQueryInfo('favorites', require('@tgin/catalog/core/gql/product/query/productElements.gql')),
  },
  data() {
    return {

      rowSize: {
        height: 100,
        width: null
      },
      queries: {
        favorites: {
          vars: {
            nocache: true,
            filter: {
              IN_FAVORITES: true
            },
            nav: {
              limit: 12
            }
          },
          state: {
            isLoading: false
          },
          result: null
        },
      },
    }
  },
  computed: {
    entitiesComp() {

      const cnt = {
        'sm': 20,
        'md': 20,
        'lg': 8,
        'xl': 12,
      }[this.$q.screen.name]

      return this.queries.favorites.result ? this.queries.favorites.result.nodes.slice(0, cnt) : []
    }
  },
  methods: {
    onNav(entity) {

      this.$router.push({
        name: 'catalog.' + entity.IBLOCK_ID + '.element.popup',
        params: {
          entityId: entity.ID
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
