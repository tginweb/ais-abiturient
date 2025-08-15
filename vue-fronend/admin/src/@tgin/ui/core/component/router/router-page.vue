<template>
  <div>

    <div
        class="flex q-px-lg q-py-sm bg-blue-grey-5 q-gutter-y-sm text-white items-center"
        v-if="title"
    >

      <div class="s-font-lg text-weight-bold">{{ title }}</div>

      <div class="q-ml-auto">

        <ui-nav-menu
            :items="toolbar"
            :excludeKeys="toolbarExclude"
            :root-dense="true"
            :root-flat="true"
            root-text-color="white"
            :callback="$routerNav"
            v-if="toolbar && toolbar.length"
            class="q-gutter-sm"
        />

      </div>

    </div>

    <q-tabs
        v-model="tabState"
        active-bg-color="grey-4"
        active-color1="white"
        align="left"
        class="text-secondary border-b-11 border-grey-4 q-px-lg q-mt-sm q-mb-md"
        dense
        indicator-color="transparent"
        narrow-indicator
    >
      <q-tab
          :label="item.label"
          :name="item.id"
          v-for="item of tabs"
          :key="item.id"
      />
    </q-tabs>

    <div class="q-px-md">
      <slot v-bind="context"/>
    </div>

  </div>
</template>

<script>

export default {
  props: {
    toolbar: {default: () => []},
    toolbarExclude: {default: () => []},
    context: {default: () => ({})},
    tabs: {default: () => []},
    tab: {default: null},
    title: {},
  },
  data() {
    return {
      tabState: this.tab,
    }
  },
  watch: {
    tab(v) {
      this.tabState = v
    },
    tabState(v) {
      this.$emit('update:tab', v)
    },
  },
}

</script>

<style lang="scss" scoped>


</style>
