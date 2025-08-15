<template>

  <div class="com">

    <div class="c-breadcrumbs q-mb-md" v-if="pathItems && pathItems.length">
      <ul class="q-pa-none">
        <li
          :key="index"
          class="d-inline-block"
          v-for="(item, index) of pathItems"
        >
          <router-link :to="item.url" v-if="item.url">{{item.title}}</router-link>
          <span v-else>{{item.title}}</span>
        </li>
      </ul>
    </div>

    <div class="c-title flex items-center no-wrap" v-if="title">

      <router-link class="block q-px-md" v-if="back" :to="backLink.url">
        <q-icon :name="$icons.chevronLeft"/>
      </router-link>

      <h1
        class="c-title-title leading-normal q-ma-none s-font-6xl font-tenor-sans text-primary-brown-gray-5"
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
          return [{TITLE: 'Главная', URL: '/'}].concat(this.path)
        }
      }
    }
  }

</script>

<style lang="scss" scoped>


  .c-title-title {

  }

  .c-breadcrumbs {
    ul {

    }

    li {
      list-style-type: none;
      display: inline-block;
      position: relative;

      &:not(:first-child) {
        padding-left: 7px;
        margin-left: 7px;

        &:before {
          content: "•";
          display: block;
          position: absolute;
          left: -2px;
          font-size: 8px;
          top: 7px;
        }
      }

      &:last-child,
      &:last-child a {
        color: #CCC;
      }
    }
  }
</style>
