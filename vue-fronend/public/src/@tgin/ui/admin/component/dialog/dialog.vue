<template>
  <div>

    <q-dialog
        v-model="valueState"
        v-bind="bindDialog"
        :content-class="{
          'ui-dialog': true,
          ['--mode-' + (isMobileSheet ? 'sheet':'dialog')]: true
        }"
        :content-style="{

        }"
        @hide="$emit('hide')"
        @before-hide="$emit('before-hide')"
        @shake="$emit('shake')"
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
      />

      <SwipeableBottomSheet
          v-if="isMobileSheet"
          v-model="valueState"
          v-bind="bindSheet"
      >

        <ui-admin-progress-inner-loading
            :value="!loaded"
        />

        <template v-if="loaded">

          <q-card :style="{maxHeight: sheetMaxHeight}" class="sheet-contents no-wrap column">

            <q-card-section class="q-pt-lg">

              <div class="c-dragger" style="position: absolute; left: 0; top: 0; width: 100%;">
                <div class="c-dragger__line"></div>
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

                <ui-menu-toolbar
                    :items="[
                        {
                          label: '...',
                          children: toolbar
                        }
                    ]"
                    :entityId="entityId"
                    :root-dense="true"
                    :root-flat="true"
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
              >
                <q-tab
                    :label="item.label"
                    :name="item.id"
                    v-for="item of tabs"
                    :key="item.id"
                />
              </q-tabs>

            </q-card-section>

            <q-card-section
                ref="bodyScroll"
                :style1="{maxHeight: sheetContentMaxHeight}"
                :class="{
                  'scroll col-shrink q-pt-none q-pb-none': true,
                  'swipe-disable': isOverflow
                }"
            >
              <div ref="body">

                <slot name="head" v-bind="context"/>

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

                <slot v-bind="context"/>

                <ui-nav-vertical-mobile
                    v-if="menu && menu.length"
                    :chevron="true"
                    :counter="true"
                    :items="menu"
                    iconClass="min-width-auto q-pr-2md"
                    itemClass="border-primary-brown-gray-1 border-b-1 border-b-last-0 leading-md"
                />

                <div
                    v-if="actionsByPosition.bottom && actionsByPosition.bottom.length"
                    class="q-gutter-y-sm q-pt-md"
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

            <div v-if="(bodyHeight - 40) > bodyScrollHeight " class="relative-position">
              <div class="c-scroll-gradient" style="">
              </div>
            </div>

            <q-card-section
                v-if="$slots.bottom || actionsByPosition.fixed && actionsByPosition.fixed.length"
                class="col-auto q-py-sm"
                style="border-top: 1px solid #F0EAE5;"
            >

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
                    :label="action.label"
                    :text-color="action.textColor"
                    class="full-width s-font-sm s-font-md-lg"
                    unelevated
                    @click="action.callback"
                />

              </div>

            </q-card-section>

          </q-card>

        </template>

      </SwipeableBottomSheet>

      <q-card
          v-else
          v-bind="bindCard"
          class="dialog-contents no-wrap column q-pb-md"
          style="background-color1: #eeeeee;"
      >
        <div v-if="!loaded && loading" :style="{height: '60px'}"></div>

        <ui-admin-progress-inner-loading
            :value="loading"
            :label="loadingLabel"
            style="z-index:2;"
        />

        <div v-if="error" class="q-pa-xl text-center">
          {{ typeof error === 'boolean' ? 'ошибка' : error }}
        </div>

        <template v-else-if="loadedOnce">

          <div
              v-if="title || $slots.head"
              class="q-mb-md"
              style="z-index:1;position:relative;"
          >

            <q-card-section
                class="c-head-header flex no-wrap q-px-lg  bg-blue-grey-5 q-gutter-y-sm text-white items-center"
                v-if="title"
                style="padding-top: 12px; padding-bottom: 12px;"
            >

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

              <div class="s-font-lg text-weight-bold q-mr-auto">{{ title }}</div>

              <slot name="header" v-bind="context"/>

              <q-btn
                  v-if="dialogMode!=='drawer'"
                  icon="close"
                  class=""
                  color="white"
                  round
                  size="10px"
                  text-color="dark"
                  unelevated
                  dense
                  @click="valueState=false"
              />


              <ui-menu-toolbar
                  v-if="headerToolbar.length"
                  :items="headerToolbar"
                  :current-url="url"
                  :exclude-keys="toolbarExclude"
                  :filter="toolbarFilter"
                  :entityId="entityId"
                  root-color="white"
                  :root-outline="true"
                  :root-dense="true"
                  :callback="onAction"
                  root-size="md"
                  class="q-gutter-x-sm"
              />

            </q-card-section>

            <div class="bg-grey-2 q-px-lg q-py-xs flex" v-if="toolbar && toolbar.length">

              <q-space/>

              <ui-menu-toolbar
                  :items="toolbar"
                  :current-url="url"
                  :exclude-keys="toolbarExclude"
                  :filter="toolbarFilter"
                  root-active-class="bg-grey-4"
                  root-color="primary"
                  :root-dense="true"
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

            <slot name="header-bottom"/>

          </div>

          <q-card-section
              ref="bodyScroll"
              class=" q-py-none q-px-lg col-shrink relative-position full-height c-modal-scroll"
              :class="{
                'scroll-y': isOverflow
              }"
          >
            <div ref="body" class="">

              <q-resize-observer @resize="onResize"/>

              <slot
                  v-bind="context"
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

          <div v-if="isOverflow" class="relative-position">
            <div class="c-scroll-gradient" style=""/>
          </div>

          <q-card-section
              class="col-auto q-pb-none"
              v-if="actionsByPosition.fixed && actionsByPosition.fixed.length || $slots.bottom"
          >

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

    </q-dialog>
  </div>
</template>

<script>

import SwipeableBottomSheet from "./src/components/SwipeToClose.vue";


export default {
  components: {
    SwipeableBottomSheet
  },
  props: {
    entityId: {},
    tabs: {default: () => []},
    tab: {default: null},
    headerToolbar: {default: () => []},
    toolbar: {default: () => []},
    toolbarExclude: {default: () => []},
    toolbarFilter: {default: null},

    context: {default: () => ({})},

    persistent: {default: false},
    loaded: {default: true},
    loading: {default: false},
    loadingLabel: {default: ''},
    error: {default: false},

    value: {},

    mobileSheet: {default: true},
    title: {},

    backEnable: {default: true},

    orderRoot: {default: false},
    orderCurrent: {default: false},
    orderIndex: {default: 0},

    dialogMode: {default: 'drawer'},
    dialogMaximized: {default: false},
    dialogWidth: {default: '448px'},
    dialogMaxWidth: {default: '80vw'},
    dialogMaxHeight: {default: '90vh'},

    sheetContentMaxHeight: {default: '92vh'},
    sheetMaxHeight: {default: '92vh'},
    sheetHeaderEnable: {default: true},

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

      loadedOnce: this.loaded
    }
  },
  computed: {

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
      }

      res.style.width = 'calc(' + this.dialogWidthState + ' - ' + this.orderIndex * 55 + 'px)'

      return res
    },

    bindDialog() {
      const res = {
        position: 'standard',
        persistent: this.persistent
      }

      if (this.isMobileSheet) {

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
            res.maximized = this.isMobileSheet || this.dialogMaximized
            break
        }
      }

      return res
    },

    actionsByPosition() {

      const res = this.actions.reduce((map, action) => {
        const pos = action.position || 'fixed'
        if (!map[pos]) map[pos] = []
        map[pos].push(action)
        return map
      }, {});

      if (this.actionsClose && this.$q.screen.lt.md) {

        if (!res[this.actionsClosePosition]) res[this.actionsClosePosition] = []

        let btn = {
          label: 'Закрыть',
          callback: () => {
            this.valueState = false
          }
        }

        if (!this.isMobileSheet) {
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

    isMobileSheet() {
      return this.mobileSheet && this.$q.screen.lt.md
    },


  },
  watch: {

    loaded(v) {
      if (v)
        this.loadedOnce = true
    },

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

      this.$emit('input', val)
    },

    bodyScrollHeight(v) {
      this.$emit('update:scrollHeight', v)
    }
  },
  methods: {

    calcWidth(width) {

    },

    onAction(item) {

      item.onResolve = () => {

        if (this.onActionSuccess)
          this.onActionSuccess()
      }

      if (typeof item === 'object') {
        if (this.entityId || this.entityIds) {
          item.args = item.args || {}
          if (item.argsIdMultiple) {
            item.args.ids = this.entityId ? [this.entityId] : this.entityIds
          } else {
            item.args.id = this.entityId
          }
        }
      }

      this.$command(item)

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

  .q-dialog__backdrop {
    background: transparent;
  }

  &.--mode-sheet {
    .q-dialog__inner {
      > div {
        max-height: calc(100vh - 30px);
      }
    }
  }
}

.c-dragger {
  display: flex;
  height: 16px;

  .c-dragger__line {
    margin: auto auto 0 auto;
    height: 5px;
    width: 64px;
    background-color: #EFEEEE;
    border-radius: 8px;
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
}

</style>
