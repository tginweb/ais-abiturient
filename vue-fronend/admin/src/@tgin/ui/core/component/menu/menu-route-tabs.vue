<template>

  <div
    :class="{
      'com-menu-route-tabs': true,
      '--left-padding-none': leftPaddingNone,
      '--font-size-inherit' : fontSize === 'inherit',
      '--separated': separated
    }"
  >

    <q-tabs
        :value="valueState"
        :align="align"
        :dense="dense"
        :active-color="activeColor"
        :active-class="activeClass"
        :active-bg-color="activeBgColor"
        :indicator-color="indicatorColor"
        inline-label
    >
      <template v-for="item of items">
        <q-route-tab
            :key="item.url"
            :class="{
                'c-item': true,
                [itemClass]: true,
                ['text-' + color]: !activeColor || item.url !== $route.path
            }"
            :content-class="item.url === $route.path ? activeContentClass : contentClass"
            :label="item.label"
            :name="item.url"
            :to="item.url"
            :icon="item.icon ? $icons[item.icon] : undefined"
            :style="{

            }"
        />
      </template>
    </q-tabs>
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    items: {default: () => ({})},
    itemClass: {},
    value: {},
    align: {default: 'justify'},
    dense: {default: true},
    indicatorColor: {default: 'primary'},
    color: {default: ''},
    contentClass: {default: null},
    activeColor: {default: 'primary'},
    activeClass: {default: null},
    activeContentClass: {default: null},
    activeBgColor: {default: null},
    leftPaddingNone: {default: true},
    fontSize: {default: 'inherit'},
    separated: {default: false},
    path: {},
  },
  data() {
    return {
      valueState: this.value
    }
  },
  watch: {
    value(v) {
      this.valueState = v
    },

    '$route.path'(v) {
      this.valueState = v
    }
  }
}
</script>

<style lang="scss" scoped>

.--left-padding-none {
  .item:first-child {
    padding-left: 0;
  }
}

.--font-size-inherit {
  /deep/ {
    .q-tab__label {
      font-size: inherit !important;
    }
  }
}

.q-tab {
  &.active {
    font-weight: bold !important;
  }
}

.com-menu-route-tabs {
  &.--separated {
    .c-item {
      border-right: 1px solid #DDD;
    }
  }
}

</style>
