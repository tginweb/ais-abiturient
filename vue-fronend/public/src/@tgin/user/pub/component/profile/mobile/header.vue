<template>

  <div class="com">

    <div class="c-title flex items-center no-wrap" v-if="title">

      <router-link class="block q-px-md" v-if="back" :to="backLink.url">
        <q-icon :name="$icons.chevronLeft"/>
      </router-link>

      <h1
          class="c-title-title leading-normal q-ma-none s-font-2xl text-weight-bold"
          v-html="title"
      />

      <div class="q-ml-auto">
        <slot name="side"></slot>
      </div>

    </div>

    <el-submenu class="q-mt-sm" v-if="showSubmenu"/>

  </div>

</template>

<script>

export default {
  props: {
    title: {},
    back: {default: false},
    path: {default: null},
    showSubmenu: {default: true}
  },
  computed: {
    backLink() {
      return this.pathItems[this.pathItems.length - 2]
    },
    pathItems() {
      if (this.path) {
        return [{NAME: 'Главная', URL: '/'}].concat(this.path)
      }
    }
  },
  data() {
    return {}
  },
}

</script>

<style lang="scss" scoped>

.c-mobile-nav {
  border-bottom: 1px solid #EEE;


  /deep/ {
    .q-tab {
      text-transform: uppercase;
      border-right: 1px solid #EEE;
    }
  }
}

</style>
