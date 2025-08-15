<template>
  <div>

    <q-dialog
        v-model="valueState"
        v-bind="bindDialog"
        :content-class="contentClassComp"
        @hide="onHide"
        @before-hide="onBeforeHide"
    >
      <q-resize-observer @resize="onResize"/>

      <div
          style="
            height: 100%;
            width:100%;
            background-color: rgba(0,0,0,0.4);
            position: fixed;
            left: 0;
            top: 0;
            pointer-events: none;
            max-width: 100%;
            max-height: 100%;
          "
          :style="{
            zIndex: zindexComp
          }"
          v-if="orderIndex > 0"
      />

      <template v-if="isMounted">

        <SwipeableBottomSheet
            v-if="isSheet"
            v-model="valueState"
            v-bind="bindSheet"
        >

          <q-card :style="{maxHeight: sheetMaxHeight}" class="sheet-contents no-wrap column">

            <div v-if="!loaded && loading" :style="{height: '60px'}"></div>

            <ui-progress-inner-loading
                :value="loading"
            />

            <template v-if="loaded">

              <q-card-section
                  :class="{
                    [sheetHeaderClass]: true
                  }"
              >

                <div class="c-dragger" style="">
                  <div class="c-dragger__line">
                    <div class="c-dragger__line__marker">

                    </div>
                  </div>
                </div>

                <div v-if="sheetHeaderEnable" class="flex col-shrink items-center no-wrap">

                  <q-btn
                      v-if="backEnable && (!actionsClose || true)"
                      :icon="$icons.chevronLeft"
                      class="q-mr-md"
                      color="primary-brown-1"
                      round
                      size="sm"
                      text-color="dark"
                      unelevated
                      @click="valueState=false"
                  />

                  <div class="s-font-md text-weight-bold">
                    {{ title }}
                  </div>

                  <slot name="header-side"/>

                  <ui-nav-menu
                      :items="[
                          {
                            label: '...',
                            children: toolbar
                          }
                      ]"
                      :root-dense="true"
                      :root-flat="true"
                      :callback="$command"
                      :current-url="url"
                      v-if="toolbar && toolbar.length"
                      class="q-gutter-sm q-ml-auto"
                  />

                </div>

                <q-tabs
                    v-model="tabState"
                    active-bg-color="grey-4"
                    active-color1="white"
                    align="justify"
                    class="text-secondary border-b-11 border-grey-4  q-mt-sm"
                    dense
                    indicator-color="transparent"
                    narrow-indicator
                    v-if="tabs && tabs.length"
                >
                  <q-tab
                      :label="item.label"
                      :name="item.id"
                      v-for="item of tabs"
                      :key="item.id"
                  />
                </q-tabs>


              </q-card-section>

              <slot name="header" v-bind="context"/>

              <q-card-section
                  ref="bodyScroll"
                  :class="{
                    'scroll col-shrink q-pt-none q-pb-none': true,
                    'swipe-disable': isOverflow,
                    [sheetBodyClass]: true
                  }"
              >
                <div ref="body">

                  <div
                      v-if="actionsByPosition.top && actionsByPosition.top.length"
                      class="q-gutter-y-sm q-mb-md"
                  >
                    <q-btn
                        v-for="(action, index) of actionsByPosition.top"
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

                  <div class="q-mb-md" v-if="$slots.default || $scopedSlots.default">
                    <slot
                        v-bind="contextComp"
                    />
                  </div>

                  <ui-menu-dialog
                      v-if="menu && menu.length"
                      :chevron="true"
                      :counter="true"
                      :items="menu"
                      iconClass="min-width-auto q-pr-2md"
                      itemClass="border-primary-brown-gray-1 border-b-1 border-b-last-0 leading-md"
                      class="q-mb-md"
                  />

                  <div
                      v-if="actionsByPosition.bottom && actionsByPosition.bottom.length"
                      class="q-gutter-y-sm q-mb-md"
                  >
                    <q-btn
                        v-for="(action, index) of actionsByPosition.bottom"
                        :key="index"
                        :color="action.color || 'primary'"
                        :icon="$icons[action.icon] || action.icon"
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

              <div v-if="dialogHideMore && ((bodyHeight - 40) > bodyScrollHeight)" class="relative-position">
                <div class="c-scroll-gradient" style="">
                </div>
              </div>

              <q-card-section
                  v-if="$scopedSlots.bottom || $slots.bottom || actionsByPosition.fixed && actionsByPosition.fixed.length"
                  class="col-auto q-py-sm"
                  style="border-top: 1px solid #F0EAE5;"
              >

                <slot name="bottom" v-bind="contextComp"/>

                <div
                    v-if="actionsByPosition.fixed && actionsByPosition.fixed.length"
                    class="row q-col-gutter-sm"
                >
                  <div
                      v-for="(action, index) of actionsByPosition.fixed"
                      :key="index"
                      :class="{
                       [action.width || 'col-24']: true
                    }"
                  >

                    <q-btn
                        :color="action.color || 'primary'"
                        :disable="!!action.disable"
                        :flat="action.flat || false"
                        :icon="$icons[action.icon] || action.icon"
                        :label="action.label"
                        :loading="action.loading"
                        :text-color="action.textColor"
                        :outline="action.outline"
                        :class="{
                          'full-width': true,
                          's-font-sm s-font-md-lg': !action.sizeClass,
                          [action.sizeClass]: !!action.sizeClass,
                        }"
                        unelevated
                        @click="action.callback"
                    />
                  </div>
                </div>

              </q-card-section>

            </template>

          </q-card>

        </SwipeableBottomSheet>

        <q-card
            v-else
            v-bind="bindCard"
            class="dialog-contents no-wrap column q-pb-md"
        >

          <div v-if="!loaded && loading" :style="{height: '60px'}"></div>

          <ui-progress-inner-loading
              :value="loading"
          />

          <template v-if="loaded">

            <div
                v-if="(title || $slots.header || $scopedSlots.header)"
                class="q-mb-md"
            >

              <q-card-section
                  class="c-head-header flex q-pt-md q-pb-none q-px-lg items-center"
                  v-if="dialogHeaderEnable"
                  style="position:relative;"
              >

                <div>
                  <q-btn
                      v-if="dialogMode==='drawer'"
                      :icon="$icons.chevronLeft"
                      class=""
                      color="primary-brown-1 q-mr-md"
                      round
                      size="8px"
                      text-color="dark"
                      unelevated
                      @click="valueState=false"
                  />
                </div>

                <div class="s-font-xl text-weight-bold q-mr-auto">{{ title }}</div>

                <slot name="header-side" v-bind="context"/>

                <q-btn
                    :icon="$icons.close"
                    class="c-close q-ml-auto"
                    color="primary-brown-1"
                    round
                    size="sm"
                    text-color="dark"
                    unelevated
                    @click="valueState=false"
                />

              </q-card-section>
              <div v-else>

                <q-btn
                    :icon="$icons.close"
                    class="c-close q-ml-auto"
                    color="primary-brown-1"
                    round
                    size="sm"
                    text-color="dark"
                    unelevated
                    @click="valueState=false"
                />

              </div>

              <div class="bg-grey-2 q-px-lg q-py-xs flex" v-if="toolbar && toolbar.length">

                <q-space/>

                <ui-nav-menu
                    :items="toolbar"
                    :current-url="url"
                    :exclude-keys="toolbarExclude"
                    :filter="toolbarFilter"
                    root-active-class="bg-grey-4"
                    :root-dense="true"
                    :root-flat="true"
                    root-text-color="dark"
                    :callback="onAction"
                    root-size="md"
                    class="q-gutter-x-sm"
                />

              </div>

              <div class="q-px-lg">
                <q-tabs
                    v-if="tabs.length"
                    v-model="tabState"
                    active-bg-color=""
                    active-color="primary"
                    align="left"
                    class="text-grey-7 q-mt-sm "
                    dense
                    indicator-color="primary"
                    narrow-indicator
                    style="border-bottom: 1px solid #CCC;"
                >
                  <q-tab
                      :label="item.label"
                      :name="item.id"
                      v-for="item of tabs"
                      :key="item.id"
                  />
                </q-tabs>

              </div>

              <slot name="header" v-bind="context"/>

            </div>

            <q-card-section
                ref="bodyScroll"
                class=" q-py-none q-px-lg col-shrink relative-position full-height"
                :class="{
                  'scroll-y': isOverflow
                }"
            >
              <div ref="body" class="">

                <q-resize-observer @resize="onResize"/>

                <ui-menu-dialog
                    v-if="menu && menu.length"
                    :chevron="true"
                    :counter="true"
                    :items="menu"
                    icon-class="min-width-auto q-pr-2md"
                    item-class="border-primary-brown-gray-1 border-b-1 border-b-last-0 leading-md"
                />

                <slot
                    v-bind="contextComp"
                    class="q-mb-md"
                />

                <div
                    v-if="actionsByPosition.bottom && actionsByPosition.bottom.length"
                    class="q-gutter-y-sm q-pt-md q-pb-sm"
                >
                  <q-btn
                      v-for="(action, index) of actionsByPosition.bottom"
                      :key="index"
                      :color="action.color || 'primary'"
                      :icon="$icons[action.icon] || action.icon"
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

            <div v-if="!dialogHideMore && isOverflow" class="relative-position">
              <div class="c-scroll-gradient" style=""/>
            </div>

            <q-card-section
                class="col-auto q-pb-none q-px-lg"
                v-if="actionsByPosition.fixed && actionsByPosition.fixed.length || $slots.bottom || $scopedSlots.bottom"
            >

              <slot name="bottom" v-bind="context"/>

              <div
                  v-if="actionsByPosition.fixed && actionsByPosition.fixed.length"
                  class="row q-col-gutter-md"
              >
                <div
                    v-for="(action, index) of actionsByPosition.fixed"
                    :key="index"
                    :class="{
                       [action.width || 'col-24']: true
                    }"
                >

                  <q-btn
                      :color="action.color || 'primary'"
                      :disable="!!action.disable"
                      :flat="action.flat || false"
                      :icon="$icons[action.icon] || action.icon"
                      :label="action.label"
                      :size="action.size"
                      :loading="action.loading"
                      :text-color="action.textColor"
                      :outline="action.outline"
                      class="full-width s-font-sm s-font-md-md"
                      unelevated
                      @click="action.callback"
                  />
                </div>
              </div>

            </q-card-section>

          </template>

        </q-card>

      </template>

    </q-dialog>
  </div>
</template>

<script>

import SwipeableBottomSheet from "./src/components/SwipeToClose.vue";
import triggerWindowResize from "@tgin/main/common/lib/util/base/triggerWindowResize";


export default {
  components: {
    SwipeableBottomSheet
  },
  props: {
    tabs: {default: () => []},
    tab: {default: null},

    toolbar: {default: () => []},
    toolbarExclude: {default: () => []},
    toolbarFilter: {default: null},

    context: {default: () => ({})},
    loaded: {default: true},
    loading: {default: false},
    value: {},

    mobileSheet: {default: true},
    title: {},

    backEnable: {default: true},

    orderRoot: {default: false},
    orderCurrent: {default: false},
    orderIndex: {default: 0},

    contentClass: {},

    dialogClass: {default: ''},
    dialogHeaderEnable: {default: true},
    dialogMode: {default: 'dialog'},
    dialogMaximized: {default: false},
    dialogWidth: {default: '448px'},
    dialogMaxWidth: {default: '80vw'},
    dialogMaxHeight: {default: '87vh'},
    dialogHideMore: {default: false},

    sheetHeaderEnable: {default: true},
    sheetBodyClass: {},
    sheetHeaderClass: {default: 'q-pt-md q-pb-sm'},
    sheetMaxHeight: {default: '92vh'},

    actionsClose: {default: false},
    actionsClosePosition: {default: 'fixed'},
    actions: {default: () => []},

    onActionSuccess: {},
    menu: {},

    scrollHeight: {default: 0},

    url: {default: null},
  },
  data() {
    return {
      valueState: this.value,
      bodyHeight: 0,
      bodyScrollHeight: 0,

      tabState: this.tab,
      dialogWidthState: this.dialogWidth,
      isMounted: false
    }
  },
  computed: {

    contentClassComp() {
      const res = {
        'ui-dialog': true,
        ['--mode-' + (this.isSheet ? 'sheet':'dialog')]: true,
        ['--backdrop-nested']: this.orderIndex > 0,
        [this.contentClass]: true
      }

      if (this.isSheet) {
        if (!this.sheetHeaderEnable) {
          res['--no-header'] = true
        }
      } else {
        if (!this.dialogHeaderEnable) {
          res['--no-header'] = true
        }
      }
      return res
    },

    contextComp() {
      return {
        ...this.context,
        ...{
          isSheet: this.isSheet
        }
      }
    },

    isOverflow() {
      return (this.bodyHeight - 40) > this.bodyScrollHeight
    },

    zindexComp() {
      return 1000 + (this.orderIndex * 10)
    },

    bindSheet() {

      const res = {
        style: {
          //maxWidth: this.dialogMaxWidth,
          //maxHeight: this.dialogMaxHeight,
          zIndex: this.zindexComp + 1
        },
      }

      //res.style.width = 'calc(' + this.dialogWidthState + ' - ' + this.orderIndex * 55 + 'px)'

      return res
    },

    bindCard() {

      const res = {
        style: {
          maxWidth: this.dialogMaxWidth,
          maxHeight: this.dialogMaxHeight,
          zIndex: this.zindexComp + 1
        },
        class: {
          [this.dialogClass]: true
        }
      }

      res.style.width = 'calc(' + this.dialogWidthState + ' - ' + this.orderIndex * 55 + 'px)'


      return res
    },

    bindDialog() {
      const res = {
        position: 'standard'
      }

      if (this.isSheet) {

        res.position = 'bottom'
        res.fullWidth = true
        res.maximized = true

      } else {

        switch (this.dialogMode) {
          case 'drawer':
            res.position = 'right'
            res.fullHeight = true
            res.maximized = true
            break
          case 'dialog':
            res.position = 'standard'
            res.maximized = this.isSheet || this.dialogMaximized
            break
        }
      }

      return res
    },

    actionsByPosition() {

      const res = this.actions.reduce((map, action) => {
        const pos = action.position || 'fixed'

        const caction = {
          ...action,
          callback: () => {
            this.$store.dispatch('command/runMenuItem', action)
          }
        }

        if (!map[pos]) map[pos] = []

        map[pos].push(caction)

        return map
      }, {})

      if (this.actionsClose && this.$q.screen.lt.md) {

        if (!res[this.actionsClosePosition]) res[this.actionsClosePosition] = []

        let btn = {
          label: 'Закрыть',
          callback: () => {
            this.valueState = false
          }
        }

        if (!this.isSheet) {
          btn = {
            ...btn,
            color: 'primary-brown-1',
            textColor: 'dark'
          }
        } else {
          btn = {
            ...btn,
            color: 'dark',
            flat: true,
          }
        }

        res[this.actionsClosePosition].push(btn)
      }

      return res
    },

    isSheet() {
      return this.mobileSheet && this.$q.screen.lt.md
    },


  },
  watch: {
    tab(v) {
      this.tabState = v
    },
    tabState(v) {
      this.$emit('update:tab', v)
    },

    value(val) {
      this.valueState = val
    },
    valueState(val) {

      if (val) {
        this.onShow()
      }
      this.$emit('input', val)
    },

    bodyScrollHeight(v) {
      this.$emit('update:scrollHeight', v)
    }
  },

  created() {

  },
  methods: {

    onShow() {
      this.fixWindow(true)
    },

    onBeforeHide() {
      const body = document.querySelector('body');
      body.classList.add('sticky-invisible')
    },

    onHide() {
      this.$emit('hide')

      this.$nextTick(() => {
        this.fixWindow()
        const body = document.querySelector('body');
        body.classList.remove('sticky-invisible')
      })
    },

    fixWindow(delay) {
      if (delay) {
        if (delay === true)
          delay = 50
        setTimeout(() => {
          this.$util.base.triggerWindowResize()
        }, delay)
      } else {
        this.$util.base.triggerWindowResize()
      }
    },

    calcWidth(width) {

    },

    onAction(data) {

      data.onResolve = () => {

        if (this.onActionSuccess)
          this.onActionSuccess()
      }

      this.$command(data)

    },

    onResize() {

      if (this.$refs.body) {
        this.bodyHeight = this.$refs.body.clientHeight
      }

      if (this.$refs.bodyScroll) {
        this.bodyScrollHeight = this.$refs.bodyScroll.$el.clientHeight
      }

    }
  },
  mounted() {
    this.onResize();
    this.isMounted = true
  }

}

</script>

<style lang="scss" scoped>

.sheet-contents {
  background: #fff;
}

.dialog-contents {
  background: #fff;
}


</style>

<style lang="scss">

.ui-dialog {


  &.--backdrop-nested {
    .q-dialog__backdrop {
      background: transparent;
    }
  }

  &.--mode-sheet {
    .q-dialog__inner {
      > div {
        max-height: calc(100vh - 30px);
      }
    }
  }

  &.--mode-dialog {

    &.--no-header {

      .dialog-contents {
        overflow: visible;
      }

      .c-close {
        position: absolute;
        top: -30px;
        right: -30px;
        background-color: #fff;
        z-index: 200;
      }
    }
  }
}

.c-dragger {
  display: flex;
  position: absolute;
  left: 0;
  top: -20px;
  width: 100%;
  height: 20px;
  pointer-events: none;

  .c-dragger__line {
    pointer-events: auto;
    margin: auto auto 0px auto;

    .c-dragger__line__marker {
      height: 5px;
      width: 64px;
      background-color: #EFEEEE;
      border-radius: 8px;
      margin-bottom: 8px;
    }
  }
}

.c-scroll-gradient {
  left: 0;
  top: -30px;
  width: 100%;
  height: 30px;
  background: linear-gradient(rgba(255, 255, 255, 0.001), white);
  position: absolute;
  pointer-events: none;
  z-index: 20;
}

</style>
