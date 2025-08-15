<template>

  <div class="com">

    <ui-breadcrumbs
      :path="pathItems"
      class="c-breadcrumbs q-mb-md"
    />

    <div v-if="titleShow" class="c-title flex items-center no-wrap">

      <router-link v-if="back && backLink" :to="backLink.URL" class="block q-px-md">
        <q-icon :name="$icons.chevronLeft"/>
      </router-link>

      <h1
        class="c-title-title leading-e4 q-ma-none s-font-4xl s-font-md-4xl font-tenor-sans text-primary-brown-gray-5"
        v-html="title"
      />

      <div class="q-ml-auto">
        <slot name="side"></slot>
      </div>

    </div>

    <el-submenu v-if="showSubmenu" class="q-mt-sm"/>

  </div>

</template>

<script>

export default {
  props: {
    title: {},
    titleShow: {default: true},
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
        return [
          {
            NAME: 'Главная',
            URL: '/'
          }
        ].concat(this.path)
      }
    }
  }
}

</script>

<style lang="scss" scoped>

.c-title {
  border-bottom: 1px solid #ddd;
  margin: 0 0 26px 0;
  padding: 0 0 10px 0;
}

</style>
