<template>

  <div class="c-actions row q-col-gutter-sm" v-if="actions.length">

    <div
        v-for="(action, index) of actions"
        :key="index"
        class="col-24 col-sm-auto"
    >
      <q-btn
          :class="{
            '--no-minheight': true,
            's-font-xs s-font-lg-md full-width': !itemSizeClass,
            [itemSizeClass]: true,
            [itemClass]: true,
          }"
          :color="typeof action.color !== 'undefined' ?  action.color : color"
          :dense="typeof action.dense !== 'undefined' ?  action.dense : dense"
          :label="action.label"
          :text-color="typeof action.textColor !== 'undefined' ?  action.textColor : textColor"
          :unelevated="typeof action.unelevated !== 'undefined' ?  action.unelevated : unelevated"
          :outline="typeof action.outline !== 'undefined' ?  action.outline : outline"
          @click.stop="action.callback()"
      />

    </div>

  </div>

</template>

<script>

export default {
  props: {
    item: {},
    itemSizeClass: {},
    itemClass: {},
    dense: {default: false},
    unelevated: {default: true},
    outline: {default: false},
    color: {default: 'primary'},
    textColor: {default: 'white'},
    actions: {default: () => []}
  },
}
</script>

<style lang="scss" scoped>


</style>
