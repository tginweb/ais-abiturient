<template functional>

  <span :class="data.staticClass || ''" v-bind="data.attrs" class="" v-if="parent.$store.getters['abit/termsById'].eduCountry[props.row.personal.fields.country] ">

    {{parent.$store.getters['abit/termsById'].eduCountry[props.row.personal.fields.country].name}}

  </span>

</template>

<script>
  export default {
    functional: true,
    props: {
      row: {},
    },
  }
</script>

<style lang="scss" scoped>


</style>
