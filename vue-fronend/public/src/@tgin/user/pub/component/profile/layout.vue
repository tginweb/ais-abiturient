<template>
  <component
    :is="$q.screen.gt.md ? 'CLayoutDesktop' : 'CLayoutMobile'"
  />
</template>

<script>

import CLayoutDesktop from './desktop/layout'
import CLayoutMobile from './mobile/layout'

export default {
  name: 'page.profile',
  components: {
    CLayoutDesktop,
    CLayoutMobile
  },
  data() {
    return {

    }
  },
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
