<template>

  <div class="widget">

    <div
        v-if="!bodyOnly"
        :class="{
          'w-header row items-center q-gutter-y-sm': true,
          [headerClass]: true
        }"
    >

      <div class="w-header__title col-grow s-font-5xl s-font-lg-8xl font-tenor-sans leading-none q-mr-xl">

        <component :is="moreUrl ? 'router-link':'span'" :to="moreUrl" class="flex items-top no-wrap" style="color: inherit;">

          <q-icon
              v-if="icon"
              :name="icon"
              class="q-mr-md q-mt-xs"
              style="font-size: 0.75em"
          />

          <div>
            {{ title }}
          </div>

        </component>

      </div>

      <div v-if="moreUrl && moreSide !== false" class="w-header__more col-shrink">

        <router-link :to="moreUrl" style="color: inherit;">

          {{ moreLabel }}

          <q-icon :name="$icons.chevronRight" class="q-ml-sm" color="dark"/>

        </router-link>

      </div>

    </div>

    <div class="w-body">

      <template v-if="loading">
        <ui-progress-skeleton v-if="skeleton" :skeletonCount="skeletonCount" :type="skeletonType"/>
      </template>
      <slot v-else></slot>

    </div>

  </div>


</template>

<script>

export default {
  components: {},
  props: {
    icon: {},
    title: String,
    loading: Boolean,
    skeleton: {default: true},
    skeletonType: {default: 'text'},
    skeletonCount: {default: 4},
    moreUrl: {},
    moreLabel: {},
    moreSide: {default: true},
    haveNext: {default: false},
    havePrev: {default: false},
    bodyOnly: {default: false},
    headerClass: {default: 'q-mb-md'},
  },
  data() {
    return {}
  },
  methods: {},
  computed: {

    skeletonEnable() {
      return this.skeleton
    }
  },
}
</script>

<style lang="scss" scoped>

.w-header__title {

}
</style>
