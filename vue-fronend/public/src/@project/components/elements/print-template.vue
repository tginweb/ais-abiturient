<template>

  <div class="com" v-if="show" v-show="false">

    <div :id="contentId">
      <div style="font-size: 12px;">
        <slot v-bind="{show}">

        </slot>
      </div>
    </div>

  </div>

</template>

<script>

  export default {
    props: {
      vars: {},
      template: {}
    },
    components: {

    },
    data() {
      return {
        show: false,
        contentId: (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
      }
    },
    methods: {



      print() {

        this.show = true

        this.$nextTick(()=>{

          this.$util.html.htmlPrint(this.contentId,{})

          this.show = false
        })
      },

    }
  }

</script>

<style lang="scss" scoped>


</style>
