import MRoute from '@common/router/mixin/route'
import {encode} from 'html-entities';

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
      title: this.pageMetaTitle,
      titleTemplate: title => `${title}`,
      meta: {
        description: {name: 'description', content: encode(this.pageDescription)},
        keywords: {name: 'keywords', content: encode(this.pageKeywords)},
        ogTitle: {name: 'og:title', content: encode(this.ogPageTitle)},
        ogDescription: {name: 'og:description', content: encode(this.ogPageDescription)},
      }
    }

    if (this.ogPageImage) {
      data.meta.image = {'name': 'og:image', 'content': this.ogPageImage}
    } else {
      data.meta.image = {'name': 'og:image', 'content': appDefaultImage}
    }

    data.link = {}

    if (this.pageCanonical) {
      data.link.canonical = {rel: 'canonical', href: appCanonical + this.pageCanonical.replace(/\/+$/, '') + '/'}
    }

    return data
  },

  methods: {

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

    pageMetaTitle() {
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
      return this.page.metaTitle || this.page.title
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
      return this.page.title
    },

    pageDescription() {
      if (this.pageData) {
        if (this.pageData.pageTitle) {
          return this.pageData.pageTitle
        } else if (this.routeEntity) {
          if (this.routeEntity.META && this.routeEntity.META.DESCRIPTION) {
            return this.routeEntity.META.DESCRIPTION
          } else if (this.routeEntity.DESCRIPTION) {
            return this.routeEntity.DESCRIPTION
          }
        }
      }
      return this.page.description
    },

    pageKeywords() {
      if (this.pageData) {
        if (this.pageData.pageTitle) {
          return this.pageData.pageTitle
        } else if (this.routeEntity) {
          if (this.routeEntity.META && this.routeEntity.META.KEYWORDS) {
            return this.routeEntity.META.KEYWORDS
          } else if (this.routeEntity.KEYWORDS) {
            return this.routeEntity.KEYWORDS
          }
        }
      }
      return this.page.keywords
    },

    ogPageImage() {
      if (this.routeEntity) {
        return this.routeEntity.SHARE && this.routeEntity.SHARE.IMAGE && this.routeEntity.SHARE.IMAGE.SRC
      }
      return this.page.image
    },

    ogPageTitle() {
      return this.pageTitle
    },

    ogPageDescription() {
      return this.pageDescription
    },


    ogPageUrl() {
      return this.routeEntity && this.routeEntity.URL
    },

    pageCanonical() {
      return this.routeEntity && this.routeEntity.URL
    }
  }

}
