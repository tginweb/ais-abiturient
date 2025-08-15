<template>

  <div class="s-info-section">

    <div class="__header flex items-center" v-if="title">

      <div class="__title">{{title}}</div>

      <q-space/>

      <slot name="header-side"/>

    </div>


    <ui-admin-data-fields
      v-if="fields && fields.length"
      :label-width="fieldLabelWidth"
      :value="fields"
    >
      <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
        <slot :name="name" v-bind="slotData"/>
      </template>
    </ui-admin-data-fields>


    <slot/>

  </div>

</template>

<script>

export default {
  props: {
    fields: {
      default: () => ([])
    },
    fieldLabelWidth: {
      default: '160px'
    },
    title: {},
  },
  data() {
    return {

    }
  },
};
</script>
<style lang="scss" scoped>


</style>
