import MRoute from "@tgin/main/router/mixin/route-private"

export default {
  mixins: [MRoute],
  data() {
    return {
      pageIs: 'user-profile-page'
    }
  },
  computed: {
    pagePath() {
      return [
        {
          url: this.$route.fullPath,
          label: this.pageTitle
        }
      ]
    },
    pagePathFull() {

      const path = [
        {
          url: this.$app.getRouteByName('user:personal', 'path'),
          label: 'Личный кабинет'
        }
      ]

      const pagePath = this.pagePath

      if (pagePath)
        Array.prototype.push.apply(path, pagePath);

      return path;
    },

    pageBack() {
      return {
        url: this.$config.get('USER.PROFILE_URL')
      }
    },
  }
}

