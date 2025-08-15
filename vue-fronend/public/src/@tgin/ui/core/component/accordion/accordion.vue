<template>

  <div>

    <q-list v-if="items" class="qx-focus-disable">

      <template
          v-for="(item, index) of items"
      >
        <q-expansion-item
            :ref="'item-' + index"
            :class="itemClass"
            :default-opened="index===0"
            :header-class="headerClass "
            :label="item.NAME"
            group="main"
            @input="onStateChange($event, item)"
            :duration="duration"
        >
          <div :class="contentClass">

            <v-runtime-template
                v-if="item.TEMPLATE"
                :template="item.TEMPLATE"
            />

            <div
                v-else
                v-html="item.VALUE"
            />

          </div>
        </q-expansion-item>
      </template>

    </q-list>

  </div>

</template>

<script>
import VRuntimeTemplate from "v-runtime-template";

export default {
  components: {
    VRuntimeTemplate,
  },
  props: {
    items: {},
    headerClass: {default: 'text-weight-bold q-px-none'},
    itemClass: {default: ''},
    contentClass: {default: ''},
    duration: {default: 100},
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    onScroll() {

    },

    onStateChange(val, item) {

      if (val) {

        if (this.$q.screen.gt.lg) return

        const index = this.items.indexOf(item)

        const el = this.$refs['item-' + index][0].$el

        setTimeout(() => {
          this.$util.dom.scrollTo({el: el, offset: 80, duration: true})
        }, this.duration + 100)

      }
    }
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

/deep/ {
  .q-item {
    min-height: auto;
  }
}

.q-expansion-item.q-expansion-item--expanded {
  border-bottom: 1px solid map-get($theme-colors, "primary-brown-gray-1");
}

</style>
