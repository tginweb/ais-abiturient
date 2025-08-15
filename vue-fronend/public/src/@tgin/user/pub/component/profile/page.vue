<template>
  <component
    :is="$q.screen.gt.md ? 'CPageDesktop' : 'CPageMobile'"
    v-if="isMounted"
    :header="header"
    :path="path"
    :title="title"
    :actions="actions"
    :loading="loading"
    :loaded="loaded"
  >
    <template v-slot:default>

      <slot/>

    </template>
  </component>
</template>

<script>

import CPageDesktop from './desktop/page'
import CPageMobile from './mobile/page'

export default {
  props: {
    title: {},
    path: {},
    header: {default: true},
    loading: {default: false},
    loaded: {default: true},
    actions: {default: () => []},
  },
  components: {
    CPageDesktop,
    CPageMobile
  },
  data() {
    return {
      isMounted: false,
    }
  },
  mounted() {
    this.isMounted = true
  }
}

</script>

<style lang="scss" scoped>

.c-card__avatar {
  line-height: 0;

  img {
    max-width: 40px;
  }
}

</style>
