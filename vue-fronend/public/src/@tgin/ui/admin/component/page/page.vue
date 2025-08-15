<template>

  <q-card
      class="com no-wrap column"
      :style="{
        height: height
      }"
  >


    <q-resize-observer @resize="onResize"/>

    <ui-admin-progress-inner-loading
        :value="!loaded"
    />

    <template v-if="loaded">

      <div
          v-if="title || $slots.head"
          :class1="{
            'q-mb-md': !contentFullHeight,
            'q-mb-xs': contentFullHeight
          }"
      >

        <q-card-section
            class="flex q-px- q-py-sm  bg-blue-grey-5 q-gutter-y-sm text-white items-center"
            v-if="title"
        >
          <q-btn
              :icon="$icons.chevronLeft"
              class=""
              color="primary-brown-1 q-mr-md"
              round
              size="8px"
              text-color="dark"
              unelevated
              @click="onBack"
          />

          <div class="s-font-lg text-weight-bold">{{ title }}</div>

          <slot name="header-side"/>

        </q-card-section>

        <div class="c-toolbar bg-grey-2 q-px-lg q-py-xs flex" v-if="toolbar && toolbar.length">

          <q-space/>

          <ui-menu-toolbar
              :items="toolbar"
              :excludeKeys="toolbarExclude"
              :root-dense="true"
              :root-flat="true"
              root-text-color="dark"
              :callback="onAction"
              root-size="15px"
              class="q-gutter-x-sm"
          />

        </div>

        <q-tabs
            v-if="tabs.length"
            v-model="tabState"
            active-bg-color=""
            active-color1="white"
            align="left"
            class="text-secondary border-b-11 border-grey-4 q-px-lg q-mt-sm "
            dense
            indicator-color="secondary"
            narrow-indicator
        >
          <q-tab
              :label="item.label"
              :name="item.id"
              v-for="item of tabs"
              :key="item.id"
          />
        </q-tabs>

        <slot name="head" v-bind="context"/>

      </div>

      <q-card-section
          ref="bodyScroll"
          class="scroll-y q-py-none  col-shrink relative-position full-height q-px-none"
      >

        <div ref="body" class="">

          <slot v-bind="context"/>

          <div
              v-if="actionsByPosition.bottom && actionsByPosition.bottom.length"
              class="q-gutter-y-sm q-pt-md q-pb-sm"
          >
            <q-btn
                v-for="(action, index) of actionsByPosition.bottom"
                :key="index"
                :color="action.color || 'primary'"
                :disable="!!action.disable"
                :flat="action.flat || false"
                :label="action.label"
                :text-color="action.textColor"
                class="full-width s-font-sm s-font-md-lg"
                unelevated
                @click="action.callback"
            />
          </div>

        </div>

      </q-card-section>

      <div v-if="(bodyHeight - 40) > bodyScrollHeight" class="relative-position">
        <div class="c-scroll-gradient" style=""/>
      </div>

      <q-card-section class="col-auto" v-if="actionsByPosition.fixed && actionsByPosition.fixed.length">

        <slot name="bottom" v-bind="context"/>

        <div
            v-if="actionsByPosition.fixed && actionsByPosition.fixed.length"
            class="q-gutter-y-sm"
        >

          <q-btn
              v-for="(action, index) of actionsByPosition.fixed"
              :key="index"
              :color="action.color || 'primary'"
              :disable="!!action.disable"
              :flat="action.flat || false"
              :icon="action.icon"
              :label="action.label"
              :loading="action.loading"
              :text-color="action.textColor"
              class="full-width s-font-sm s-font-md-md"
              unelevated
              @click="action.callback"
          />

        </div>

      </q-card-section>

    </template>

  </q-card>

</template>

<script>

import VroutePage from '@tgin/main/router/mixin/vroute-page'

export default {
  mixins: [VroutePage],
  props: {
    height: {default: '100vh'},
    contentFullHeight: {default: false},
  },
  data() {
    return {}
  },
  methods: {
    onAction(item) {

      item.onResolve = (res) => {
        this.$emit('action-resolve', item, res)
      }

      this.$command(item)
    }
  }
}

</script>

<style lang="scss" scoped>

.c-scroll-gradient {
  left: 0;
  top: -50px;
  width: 100%;
  height: 50px;
  background: linear-gradient(rgba(255, 255, 255, 0.1), white);
  position: absolute;
  pointer-events: none;
}


.c-toolbar {
  border-bottom: 1px solid #AAA;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.1);
}

</style>
