<template>

  <div class="com">

    <c-notify-dispatcher/>
    <c-bus/>

  </div>

</template>

<script>

import CNotifyDispatcher from '@tgin/ui/core/component/notify-dispatcher/notify-dispatcher'
import CBus from '@tgin/ui/core/component/bus/bus'

export default {
  components: {
    CNotifyDispatcher,
    CBus
  },
  data() {
    return {
      adminMenuOpened: false
    }
  },
  mounted() {
    this.$bus.on('loadingStart', this.onLoadingStart);
    this.$bus.on('loadingStop', this.onLoadingStop);
    //this.$bus.on('route.first.resolved', this.onRouteFirstResolved);
  },

  beforeDestroy() {
    this.$options.allDialogs = null

    this.$bus.off('loadingStart', this.onLoadingStart);
    this.$bus.off('loadingStop', this.onLoadingStop);

    //this.$bus.off('route.first.resolved', this.onRouteFirstResolved);
  },
  methods: {

    onLoadingStart(opt) {
      this.$q.loading.show(opt)
    },
    onLoadingStop() {
      this.$q.loading.hide()
    },
    onKeypress(r) {
      this.adminMenuOpened = !this.adminMenuOpened
    }
  },
  computed: {
    vrouterRouteHashUrl() {
      return this.$store.getters['router/vrouterRouteHashUrl']
    }
  },
  watch: {
    vrouterRouteHashUrl(hash) {

      return

      const [fullPath] = this.$route.fullPath.split('#')

      history.pushState(
          {},
          null,
          fullPath + (hash || '')
      )
    }
  }
}

</script>

<style lang="scss">


</style>
