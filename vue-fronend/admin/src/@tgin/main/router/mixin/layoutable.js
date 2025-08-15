export default {

  computed: {

    routePageInfo() {
      const matched = this.$route.matched[this.$route.matched.length-1]
      const com = matched.instance || matched.instances.default

      return {
        'title': com.pageTitle,
        'backUrl': com.pageBackUrl,
        'backTitle': com.pageBackTitle,
      }
    },
  }
}
