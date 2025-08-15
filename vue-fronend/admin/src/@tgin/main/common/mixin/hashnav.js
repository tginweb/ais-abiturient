export default {
  watch: {
    '$route.hash'(v) {
      this.gotoHash(v)
    }
  },
  methods: {
    gotoHash(el) {
      this.$util.dom.scrollTo({el: el, offset: 80, duration: true})
    },
  },
}

