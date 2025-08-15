<template>

  <div class="com">

    <div v-intersection="onIntersection" v-if="infinity"></div>

    <div v-if="valueState < max" v-show="showMore" class="text-center">
      <q-btn
          class="full-width"
          color="white"
          label="загрузить еще"
          text-color="dark"
          @click="onMore"
      />
    </div>

    <div class="flex flex-center q-mt-lg" v-show="showPages">
      <q-btn
          v-for="(item, index) of items"
          :key="index"
          :flat="item.page !== valueState"
          :label="item.page"
          :to="item.url"
          color="primary"
          type="a"
      />
    </div>

  </div>

</template>

<script>

export default {
  props: {
    max: {default: 1},
    maxPages: {default: 8},
    value: {},
    url: {},
    loading: {default: false},
    infinity: {default: false},

    showPages: {default: true},
    showMore: {default: true},
  },
  data() {
    return {
      valueState: this.value
    }
  },
  computed: {

    pageUrlTemplate() {
      if (this.url) {
        return this.url
      } else {
        return this.$store.getters['router/queryNavPagerUrlTemplate']
      }
    },

    items() {
      const res = [];
      for (let i = 1; i <= this.max; i++) {
        res.push({
          type: 'page',
          page: i,
          url: this.pageUrlTemplate.replace('%page%', i)
        })
      }
      return res
    }
  },
  watch: {
    valueState(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.valueState = val
    },
    '$route': {
      handler: function (val) {

      },
      deep: true
    },
  },
  methods: {
    onMore() {
      this.$emit('more')
    },
    onIntersection(info) {
      if (info.isIntersecting) {
        this.onMore()
      }
    },
  }
};
</script>
<style lang="scss" scoped>

.c-separator {
  font-size: 8px;
  line-height: 1;
  vertical-align: middle;
}

</style>
