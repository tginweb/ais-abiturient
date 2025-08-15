<template>


  <q-toolbar-title class="c-head-title row items-center no-wrap" shrink>

    <span class="__name col-auto q-ml-sm s-font-sm s-font-sm-lg s-font-lg-3xl">

      <img class="__logo" src="/statics/logo.png" style="height: 1.3em;vertical-align: middle;">

      <span style="vertical-align: middle;" class="q-pl-sm">

         <span class="gt-sm">ИРНИТУ</span>
         <span class="lt-md">Абитуриент</span>

      </span>

    </span>

    <span class="__desc gt-md">
      <span class="__delim q-ma-sm">/</span>
      {{title || 'Личный кабинет абитуриента'}}
    </span>

    <span class="__desc lt-lg gt-sm">
      <span class="__delim q-ma-sm">/</span>
      {{title || 'Абитуриент'}}
    </span>

  </q-toolbar-title>


</template>

<script>

  export default {
    components: {},
    props: {
      title: {}
    },
    data() {
      return {}
    },


  }
</script>

<style lang="sass" scoped>


  .c-head-title
    .__logo
      max-height: 35px

    .__name
      color: #428bca
      text-transform: uppercase
      font-weight: 700

    .__desc
      font-size: 20px
      line-height: 1em
      font-weight: 300
      color: #666

    @media (max-width: $breakpoint-xs-max)
      .__logo
        max-height: 23px


</style>
