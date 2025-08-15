<template>
  <q-page class="">
    <div class="container nopad-lt-lg">

      <router-view/>

    </div>
  </q-page>
</template>

<script>


export default {
  name: 'page.profile',
  components: {},
  props: {
    menu: {}
  },
  data() {
    return {}
  },
}

</script>

<style lang="scss" scoped>

.c-menu__item {
  padding: 10px 0 10px 0;
  border-bottom: 1px solid #EFEEEE;
}

</style>
