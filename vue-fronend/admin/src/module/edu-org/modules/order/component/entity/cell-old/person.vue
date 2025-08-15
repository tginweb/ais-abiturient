<template functional>

  <span :class="data.staticClass || ''" v-bind="data.attrs">

    <div class="text-weight-bold relative-position">
      {{[
      props.row.anket.fields.personal.lastName,
      props.row.anket.fields.personal.firstName,
      props.row.anket.fields.personal.secondName
      ].join(' ')}}
    </div>

    <div class="q-mt-xs text-grey-7">
      {{ props.row.anket.fields.personal.doc.serial }}
      {{ props.row.anket.fields.personal.doc.number }}
    </div>

    <div class="">
      {{ row.personal.fields.country }}
    </div>

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
