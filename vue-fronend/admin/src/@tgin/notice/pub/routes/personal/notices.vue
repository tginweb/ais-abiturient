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
            :queryResult.sync="queries.entities.result"
            :queryState.sync="queries.entities.state"
            :queryVars="entitiesVars"
        >
          <template v-slot:default="{items, firstLoaded}">

            <div
                v-if="items.length"
            >
              <notice-entity-item
                  v-for="item of items"
                  :key="item.ID"
                  :col-product-enable="true"
                  :item="item"
                  class="q-py-lg"
                  :ref="'item-'+item.ID"
              />
            </div>

            <div v-if="!items.length && firstLoaded" class="text-primary-brown-gray-4">
              нет уведомлений
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
import {userNoticesRead} from "@tgin/notice/pub/store/actions";

export default {
  mixins: [MRoute, MRouteNav],
  components: {},
  apollo: {
    entities: generateQueryInfo('entities', require('@tgin/notice/pub/gql/query/user_recordset.gql'), {
      fetchPolicy: 'no-cache',
      prefetch: false,
    }, {
      varPath: 'entitiesVars',
    }),
  },
  props: {
    entityId: {}
  },
  data() {
    return {
      queriesLoading: 0,
      page: {
        title: 'Уведомления',
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
  async mounted() {

    setTimeout(async () => {
      try {
        await this.$store.dispatch('notice_pub/userNoticesRead', {})
      } catch (e) {
        console.log(e)
      }
    }, 2000)

  },
  created() {
    this.$bus.on('entity:notice.changed', this.refetch);
  },
  beforeDestroy() {
    this.$bus.off('entity:notice.changed', this.refetch);
  },
  watch: {
    'queries.entities.result'() {

      if (this.entityId) {
        setTimeout(() => {
          if (this.$util.base.deepGet(this.$refs, 'item-' + this.entityId + '.0.$el'))
            this.$util.dom.scrollTo({el: this.$refs['item-' + this.entityId][0].$el})
        }, 50)
      }

    }
  }
}
</script>
<style lang="scss">


</style>
