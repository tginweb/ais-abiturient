import screenExtend from "../lib/screen-extend";

export default {
  props: {},

  computed: {

    screen() {
      let result = {}, screen

      if (typeof window === 'undefined' || process.env.SERVER) {
        screen = this.$store.getters['screen/screen']
      } else {
        screen = this.$q.screen
      }

      return screenExtend(screen)
    }

  },

  watch: {

  }

}

