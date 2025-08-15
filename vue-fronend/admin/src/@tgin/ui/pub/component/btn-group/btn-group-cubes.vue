<template>

  <div class="flex q-gutter-x-sm">
    <q-btn
        v-for="(item, index) of itemsComp"
        :key="index"
        v-bind="item"
        dense
        unelevated
        class="c-btn --normal"
    />
  </div>

</template>

<script>


export default {

  props: {
    items: {},
    btnSize: {default: 'md'},
    btnTextColor: {default: 'dark'},
    btnClass: {default: 'q-pa-sm'},
    btnColor: {default: 'primary-brown-gray-1'},
    labelHide: {},
    linkNative: {default: false},
    targetBlank: {default: false},
  },

  computed: {
    itemsComp() {
      return this.items.map(item => {
        const res = {
          class: this.btnClass,
          color: this.btnColor,
          icon: this.$icons[item.ICON],
          'text-color': this.btnTextColor,
        }

        if (this.btnSize) {
          res.size = item.btnSize
        }
        if (!this.labelHide) {
          res.label = item.NAME
        }
        if (this.linkNative || item.NATIVE || item.URL.match(/\w+\:/) || item.BLANK) {
          res.type = 'a'
          res.href = item.URL
          res.target = this.targetBlank || item.BLANK ? '_blank' : '_top'
        } else {
          res.type = 'button'
          res.to = item.URL
        }
        return res;
      });
    },
  }
}
</script>

<style lang="scss" scoped>

  .c-btn {
    /deep/ {
      .q-btn__content {
        line-height: 1;
      }
    }
  }

</style>
