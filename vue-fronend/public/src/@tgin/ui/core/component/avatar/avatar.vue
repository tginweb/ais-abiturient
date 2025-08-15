<template>

  <div
      v-bind="bind"
      class="com"
  >

  </div>

</template>

<script>

export default {
  components: {},
  props: {
    src: {},
    size: {default: '64px'},
  },
  data() {
    return {}
  },
  computed: {
    bind() {
      const res = {
        style: {
          backgroundImage: 'url(' + this.src + ')',
          width: this.size,
          height: this.size,
        }
      }
      return res
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>

.com {
  position: relative;
  vertical-align: middle;
  display: inline-block;
  border-radius: 50%;
  background-position: center center;
  background-size: cover;
}

</style>
