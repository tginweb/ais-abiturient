<template>

  <div class="com q-pa-lg">

    <div class="row q-col-gutter-lg items-center">

      <router-link
          v-for="(item, index) in childrenComp"
          :key="item.url"
          :to="item.url"
          class="col-8 col-xl-6 flex items-center"
          @click.native="onItemClick"
      >
        <div
            :style="{
              backgroundImage: item.image ? 'url('+item.image.SRC+')' : null
            }"
            class="item-image q-mr-md"
        >
        </div>
        <div>
          {{ item.label }}
        </div>
      </router-link>

    </div>

  </div>

</template>

<script>
export default {
  props: {
    node: {},
    value: {}
  },
  data() {
    return {}
  },
  watch: {},
  computed: {
    childrenComp() {
      return this.node.children && this.node.children.map(item => ({
        ...item,
        image: item.image ? {
          ...item.image,
          //SRC: this.$image.resolveUrl(item.image.SRC, 'r100')
        } : null
      }))
    }
  },
  methods: {
    onItemClick() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

.com {
  text-align: left;
  min-width: 230px
}

.item-image {
  width: 55px;
  height: 45px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
}

</style>
