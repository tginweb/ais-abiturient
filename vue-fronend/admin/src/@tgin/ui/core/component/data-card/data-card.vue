<template>

  <div
      class="ui-data-card"
      :class="{
        '-bordered': bordered
      }"
  >

    <div class="__header flex items-center" v-if="title">

      <div class="__title">{{ title }}</div>

      <q-space/>

      <slot name="header-side"/>

    </div>

    <ui-data-fields
        v-if="fields && fields.length"
        :label-width="fieldLabelWidth"
        :value="fields"
    >
      <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
        <slot :name="name" v-bind="slotData"/>
      </template>
    </ui-data-fields>

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
    bordered: {},
  },
  data() {
    return {}
  },
};
</script>
<style lang="scss">

.ui-data-card {

  &:last-child {
    margin-bottom: 0;
  }

  background-color: #fff;

  &.-bordered {
    border: 1px solid #eee;
    padding: 20px;
  }

  .__header {
    margin: 0 0 10px 0;

    .__title {
      font-size: 20px;
    }

    .__side {

    }
  }

  .__items {

    .__item {
      padding-left: 0;
      padding-right: 0;

      &:not(:last-child) {
        border-bottom: 1px dotted #ddd;
      }
    }

    .__title {
      min-width: 160px;
      width: 160px;
      justify-content: start;
      color: #777;
      flex: none;
    }

    .__value {
      text-align: left;
      justify-content: start;
      color: #111;
    }

    @media (max-width: $breakpoint-sm-max) {

      .__item {
        display: block;
      }

      .__title {
        width: 100%;
      }

      .__value {
        width: 100%;
        align-items: normal;
        padding-left: 0;
      }
    }

  }

}


</style>
