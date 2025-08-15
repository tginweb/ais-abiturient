import MRoute from '@common/router/mixin/route'

export default {
  mixins: [MRoute],
  data() {
    return {
      page: {}
    }
  },
  meta() {

    const appTitle = this.$config.get('APP.TITLE')
    const appCanonical = this.$config.get('APP.CANONICAL')
    const appDefaultImage = this.$config.get('APP.IMAGE')

    const data = {
      title: this.pageTitle,
      titleTemplate: title => `${title} - ${appTitle}`,
      meta: {

      }
    }

    return data
  },

  watch: {
    pageInfo: {
      immediate: true,
      handler(val, oldVal) {
        this.$store.dispatch('router/setPageInfo', val)
      },
    },
  },

  computed: {

    routeEntity() {
      return this.pageData.entity
    },

    pageInfo() {
      return {
        title: this.pageTitle,
        desc: this.ogPageDesc,
        url: this.ogPageUrl,
        back: this.pageBack,
      }
    },

    pageBack() {
      return {}
    },

    pageTitle() {
      if (this.pageData) {
        if (this.pageData.pageTitle) {
          return this.pageData.pageTitle
        } else if (this.routeEntity) {
          if (this.routeEntity.META && this.routeEntity.META.TITLE) {
            return this.routeEntity.META.TITLE
          } else {
            return this.routeEntity.NAME
          }
        }
      }
      return this.page ? this.page.title : null
    },
  }

}
