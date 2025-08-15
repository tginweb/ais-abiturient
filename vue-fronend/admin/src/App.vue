<template>
  <div id="q-app" class="">

    <CSystem/>

    <CVroutes
        default-dialog-is="ui-admin-dialog"
        default-page-is="ui-admin-page"
    />

    <div v-if="show">
        <router-view></router-view>
    </div>

    <div
        v-if="!isMounted"
        style="position:fixed; top:0; left:0; z-index: 1000; width:100%; height:100%; display: flex;"
    >
      <div style="margin: auto;">
        <img src="/statics/spinner.gif"/>
      </div>
    </div>

  </div>
</template>

<script>
import CSystem from '@tgin/app/admin/component/system'
import CVroutes from '@tgin/main/router/component/vroutes'

export default {
  name: 'App',
  components: {
    CSystem,
    CVroutes,
  },
  data() {
    return {
      //show: process.env.SERVER,
      show: true,
      isMounted: true
    }
  },
  created() {

  },
  computed: {},
  mounted() {

    this.isMounted = true
    this.show = true
  },
  async preFetch(ctx) {

    //await ctx.store.dispatch('fetchStateCommon')
  },
}
</script>
<style>
html, body {
  overscroll-behavior-x: none;
}
</style>
