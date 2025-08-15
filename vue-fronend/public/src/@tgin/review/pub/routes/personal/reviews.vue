<template>

  <component
      v-bind="pageViewBind"
      :header="$q.screen.gt.md"
      :path="pagePathFull"
      :title="page.title"
      class=""
  >

    <div class="q-px-md q-px-lg-none q-mt-md q-mt-lg-none">

      <div class="q-mb-md">


        <ui-query
            :pagerInfinity="true"
            :queryHandler="()=>$apollo.queries.entities"
            :queryResult="queries.entities.result"
            :queryState.sync="queries.entities.state"
            :queryVars="entitiesVars"
            :item-processor="(item) => $store.getters['iblock/prepareElement'](item, {mapPropValues: true})"
        >
          <template v-slot:default="{items, firstLoaded}">

            <div
                v-if="items.length"
                class="tree"
            >
              <ul class="q-px-none">
                <review-entity-user
                    v-for="item of items"
                    :key="item.ID"
                    :col-product-enable="true"
                    :item="item"
                    class1="q-py-lg border-b-1 border-primary-brown-gray-1"
                    colImageClass1="col-2 q-mr-2md"
                />
              </ul>

            </div>

            <div v-if="!items.length && firstLoaded" class="text-primary-brown-gray-4">
              нет отзывов
            </div>

          </template>
        </ui-query>

      </div>

    </div>

  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MRouteNav from "@tgin/main/router/mixin/route-nav"
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info"

export default {
  mixins: [MRoute, MRouteNav],
  components: {},
  apollo: {
    entities: generateQueryInfo('entities', require('@tgin/review/pub/gql/query/user_recordset.gql'), {
      fetchPolicy: 'no-cache',
      prefetch: false,
    }, {
      varPath: 'entitiesVars',
    }),
  },
  data() {
    return {
      queriesLoading: 0,
      page: {
        title: 'Отзывы',
      },
      queries: {
        entities: {
          state: {
            isLoading: false
          },
          result: null
        },
      }
    }
  },
  computed: {

    entitiesVars() {
      return {
        elementInclude: true,
        nav: {
          ...this.routeNav,
          limit: 10
        }
      }
    }
  },
  methods: {
    refetch() {
      this.$apollo.queries.entities.refetch()
    },
  },
  created() {
    this.$bus.on('entity.changed:review', this.refetch);
  },
  beforeDestroy() {
    this.$bus.off('entity.changed:review', this.refetch);
  },
  watch: {}
}
</script>
<style lang="scss" >


.tree {

}

.tree li {
  list-style-type: none;
  margin: 0;
  padding1: 10px 5px 0 5px;
  position: relative
}

.tree li::before, .tree li::after {
  content: '';
  left: -20px;
  position: absolute;
  right: auto
}

.tree li::before {
  border-left: 1px solid #999;
  bottom: 50px;
  height: 100%;
  top: 0;
  width: 1px
}

.tree li:last-child::before {
  height: 21px
}

.tree li::after {
  border-top: 1px solid #999;
  height: 20px;
  top: 21px;
  width: 17px
}



.tree li span {

}

.tree > ul > li::before, .tree > ul > li::after {
  border: 0
}



.tree li.parent_li > span:hover, .tree li.parent_li > span:hover + ul li span {
  background: #eee;
  border: 1px solid #94a0b4;
  color: #000
}

</style>
