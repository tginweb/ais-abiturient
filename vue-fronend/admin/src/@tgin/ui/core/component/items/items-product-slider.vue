<template>

  <div class="com" style="">

    <div class="row no-wrap">

      <component
          v-for="(item, index) in items"
          :key="index"
          v-bind="bindItem(item, index)"
          :index="index"
      />

    </div>

  </div>

</template>

<script>
import Parent from './items-grid'

export default {
  extends: Parent,
  props: {
    itemClass: {default: 'col-12 col-sm-12 col-md-8 col-lg-6 col-xl-6'},
  },
  computed: {}
}
</script>

<style lang="scss" scoped>

.com {
  margin-left: -16px;
  margin-right: -16px;
  overflow-x: auto;
  overflow-y: hidden;

  @media (min-width: $breakpoint-sm) {
    margin-left: -12px;
    margin-right: -12px;
  }
}

.query-item {
  margin-bottom: 0 !important;
}

.row {

  @media (min-width: $breakpoint-xs) and (max-width: $breakpoint-sm) {
    max-width: 96%;
  }

  @media (min-width: $breakpoint-sm) and (max-width: $breakpoint-md) {
    max-width: 96%;
  }
}


</style>
