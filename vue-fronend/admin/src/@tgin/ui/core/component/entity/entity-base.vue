<template>

  <div class="query-item">

    {{ item }}

  </div>

</template>

<script>

export default {
  props: {
    moreMode: {},
    item: {},
    entityData: {},
    index: {},
    disableLink: {
      default: false
    },
  },
  data() {
    return {
      entity: this.item || this.entityData
    }
  },
  methods: {},
  computed: {

    compUrl() {
      return this.entity.URL
    },

    bind() {
      let res = {
        id: 'qi-' + this.entity.ID,
        class: {}
      }
      res.class['qi-type-' + this.entity.__typename] = true;
      res.class['qi-' + this.$options.name] = true;
      return res;
    },

    bindLink() {
      const res = {}

      let url = this.compUrl

      if (this.disableLink) {
        res.is = 'div'
      } else if (this.moreMode) {
        url += '?mm=1'
        res.is = 'a'
        res.href = url
        res.target = '_blank'
      } else if (url && (url.indexOf('http://') === 0 || url.indexOf('https://') === 0)) {
        res.is = 'a'
        res.href = url
        res.target = '_blank'
      } else if (url) {
        res.is = 'router-link'
        res.to = url
      } else {
        res.is = 'div'
      }

      return res
    },

  }
}
</script>

<style lang="scss" scoped>

.query-item {

}

</style>
