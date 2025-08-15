<template>

  <q-header class="bg-white text-dark" elevated>
    <q-toolbar style="min-height: 40px;">

      <div class="s-font-xl q-mr-xl text-weight-bold">{{ title }}</div>

      <q-space/>

    </q-toolbar>
  </q-header>

</template>

<script>

export default {
  props: {
    title: {}
  },
  components: {},
  data() {
    return {}
  },
  computed: {

  },
  methods: {
    onMenuItemClick(item) {
      try {
        this.$router.push({path: item.url, query: {vroute: true}}, ()=>{}, ()=>{} )
      } catch (e) {

      }
    }
  }
}
</script>

<style lang="scss">


</style>
