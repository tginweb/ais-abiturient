<template>

  <div class="s-info-section">

    <div class="__header">
      <div class="__title">{{title}}</div>
    </div>

    <ui-admin-data-fields
      v-if="fields && fields.length"
      :value="fields"
    />

    <slot/>

  </div>

</template>

<script>

export default {
  props: {
    fields: {
      default: () => ([])
    },
    title: {}
  },
  data() {
    return {

    }
  },
};
</script>
<style lang="scss" scoped>


</style>
