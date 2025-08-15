export default {
  data() {
    return {
    }
  },
  computed: {
    tLang() {
      return this.$store && this.$store.state && this.$store.state.i18n && this.$store.state.i18n.lang
    },
    t() {
      return this.$store && this.$store.getters['i18n/translatesNamespaced']
    },

  },
  watch: {},
  methods: {

  },
}

