<template>

  <div v-bind="bind" class="relative-position">

    <slot v-bind="{query, result, loading, qid, firstLoading, firstLoaded, items, state, onNavMore}"></slot>

    <ui-pager
        v-if="firstLoaded && pagerEnable && info.pages && (info.pages > 1)"
        v-model="page"
        :infinity="pagerInfinity"
        :loading="loading"
        :max="info.pages"
        :showMore="fetchMoreError"
        :showPages="fetchMoreError"
        class=" q-mt-lg"
        @more="onNavMore"
    />

    <div
        v-if="loading"
        class="flex"
        style="position: absolute; left:0; top:0; bottom:0; right:0; margin-bottom: 200px; pointer-events: none; "
    >
      <q-spinner
          :thickness="8"
          color="primary"
          size="3em"
          style="position: sticky; top: 50vh;"
          class="q-mx-auto"
      />
    </div>

    <q-inner-loading :showing="loading">
      <span></span>
    </q-inner-loading>

  </div>

</template>

<script>

import {scroll} from 'quasar'

const {getScrollPosition, setScrollPosition} = scroll

export default {
  components: {},
  props: {
    query: {},
    queryHandler: {},
    queryVars: {},
    queryState: {},
    queryResult: {},
    queryId: {},
    widget: {
      type: Object,
      default: () => ({}),
    },
    pagerEnable: {default: true},
    pagerInfinity: {default: false},
    minHeightEnable: {default: true},
    minHeight: {default: 200},
    loadingMinHeight: {default: '100px'},
    isRecordset: {default: true},

    itemProcessor: {},
  },
  data() {
    return {
      vars: this.queryVars || this.query && this.query.vars || {},
      state: this.queryState || this.query && this.query.state || {},
      result: this.queryResult || this.query && this.query.result || {},
      firstLoaded: false,
      scrollTargetRef: null,
      currentItemIndex: null,
      fetchMoreError: null
    }
  },
  created() {
    this.firstLoaded = this.isRecordset ? !!this.result.nodes : !!this.result
  },
  computed: {
    bind() {
      const res = {
        style: {}
      }
      /*
      if (this.minHeightEnable && this.minHeight) {
        res.style.minHeight = this.minHeight + 'px'
      }
       */

      if (this.loading) {
        res.style.minHeight = this.loadingMinHeight
      }
      return res
    },
    page: {
      get: function () {
        return this.info.page
      },
      set: function (val) {


      }
    },
    handler() {
      return this.queryHandler();
    },
    qid() {
      return this.queryId
    },
    itemsFirst() {
      return this.items.length && this.items[0]
    },
    items() {
      const items = this.isRecordset ? this.result && this.result.nodes || [] : this.result || []
      return this.itemProcessor ? items.map(item => this.itemProcessor(item)) : items
    },
    info() {
      return this.result && this.result.info || {}
    },
    loaded() {
      return !!(this.queryResult || this.query && this.query.result)
    },
    loading() {
      return this.state && this.state.isLoading
    },
    firstLoading() {
      return this.state && this.state.isLoading && !this.firstLoaded
    },
    currentItem() {
      return this.items[this.currentItemIndex] && this.items[this.currentItemIndex]
    },
    currentItemId() {
      return this.items[this.currentItemIndex] && this.items[this.currentItemIndex].ID
    },
  },
  methods: {

    setFirstLoaded() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.firstLoaded = true
        }, 400)
      })
    },

    onNavMoreIntersection(info) {
      if (info.isIntersecting) {
        this.onNavMore()
      }
    },

    setCurrentItem(val, reset = false) {

      let index

      if (typeof val === 'object')
        index = this.items.indexOf(this.items.find(item => item._id === val._id))
      else if (typeof val === 'string')
        index = this.items.indexOf(this.items.find(item => item._id === val))
      else if (typeof val === 'number')
        index = val

      if (reset) {
        this.currentItemIndex = null;

        this.$nextTick(() => {
          this.currentItemIndex = index
        })

      } else {
        this.currentItemIndex = index
      }

    },

    onNavMore(e = null) {

      // e && e.preventDefault();

      if (!this.info.nextPage) return;

      if (this.navLoading) return;

      if (this.navTimeout) clearTimeout(this.navTimeout)


      let scrollPos

      if (this.scrollTargetRef) {
        scrollPos = this.$refs[this.scrollTargetRef].getScrollPosition()
      } else {
        scrollPos = getScrollPosition(window)
      }

      const prevMode = this.state.mode

      this.navTimeout = setTimeout(async () => {

        this.fetchMoreError = null
        this.navLoading = true

        this.state.mode = 'more'

        try {

          await this.handler.fetchMore({
            fetchPolicy: 'network-only',

            variables: this.$util.base.deepSet(
                {
                  ...this.vars
                },
                'nav.page',
                this.info.nextPage
            ),

            updateQuery: (previousResult, {fetchMoreResult}) => {


              const res = fetchMoreResult.res

              if (!res.nodes || !res.nodes.length) {

              }

              const newRes = {
                res: {
                  __typename: this.result.__typename,
                  nodes: [...this.items, ...res.nodes],
                  info: res.info,
                }
              }

              this.result = newRes.res

              this.fetchMoreError = false

              this.$nextTick(() => {

                setTimeout(() => {
                  this.navLoading = false
                  this.state.mode = prevMode
                }, 100)

              })

              return newRes
            },
          })
        } catch (e) {
          this.fetchMoreError = true
          this.navLoading = false
        }

      }, 300)

    }
  },
  mounted() {

  },
  watch: {
    query: {
      handler: function (val) {
        this.vars = val.vars
        this.state = val.state
        this.result = val.result
      },
      deep: true
    },
    queryVars: {
      handler: function (val) {
        this.vars = val
      },
      deep: true
    },
    queryState: {
      handler: function (val) {
        this.state = val
      },
      deep: true
    },
    queryResult: {
      handler: function (val) {
        this.setFirstLoaded()
        this.result = val
      },
      deep: true
    },

    vars: {
      handler: function (val) {
        this.$emit('update:queryVars', val)
      },
      deep: true
    },
    state: {
      handler: function (val) {
        this.$emit('update:queryState', val)
      },
      deep: true
    },
    result: {
      handler: function (val) {
        this.setFirstLoaded()
        this.$emit('update:queryResult', val)
      },
      deep: true
    },
  }
}
</script>

<style lang="scss" scoped>

.ssd {
  .pagination-widget__page {
    display: block;
    width: 65px;
    height: 49px;
    box-sizing: border-box;
  }
}

</style>
