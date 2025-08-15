<script>
import {QTabs} from 'quasar'

export default {
  extends: QTabs,

  methods: {

    __scrollTowards (value) {
      const content = this.$refs.content
      const max = this.vertical === true ? content.scrollHeight - content.offsetHeight : content.scrollWidth - content.offsetWidth

      let pos = this.__getScrollPosition(content)
      let done = false

      value = Math.max(0, Math.min(max, value))

      const direction = value < pos ? -1 : 1

      pos += direction * 100

      if (
          (direction === -1 && pos <= value) ||
          (direction === 1 && pos >= value)
      ) {
        done = true
        pos = value
      }

      this.__setScrollPosition(content, pos)
      this.__updateArrows()

      return done
    },

  },


};
</script>
<style lang="scss" scoped>


</style>
