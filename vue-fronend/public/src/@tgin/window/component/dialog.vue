<template>
  <div>

    <ui-dialog
        v-model="valueState"
        :hide-overlay="true"
        :click-to-close="false"
        :prevent-click="true"
        :drag="true"
        drag-selector=".c-header"
        :fit-parent="true"
        :resize="true"
        :resize-directions="['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']"

        classes="modal-container"
        content-class="modal-content"
        :z-index="zindexComp"
        v-on="$listeners"

        @resize:move="onResize"

        :contentStyle="size"
    >

      <template v-slot:default="ctx">


        <ui-admin-progress-inner-loading
            :value="!loaded"
        />

        <template v-else-if>

          <div
              v-if="title || $slots.head"
              class="modal__title q-pb-md"
              @click="onMouseDown"
          >

            <div
                class="c-header flex q-px-lg q-py-sm  bg-blue-grey-5 text-white items-center"
                v-if="title"
            >

              <div class="s-font-lg text-weight-bold" style="pointer-events: none;">{{ title }}</div>

              <q-btn
                  v-if="dialogMode!=='drawer'"
                  :icon="$icons.close"
                  class="q-ml-auto"
                  color="primary-brown-1"
                  round
                  size="sm"
                  text-color="dark"
                  unelevated
                  @click="valueState=false"
              />

            </div>

            <div class="bg-grey-3 q-px-lg q-py-xs" v-if="toolbar && toolbar.length">

              <ui-nav-menu
                  :items="toolbar"
                  :excludeKeys="toolbarExclude"
                  :root-dense="true"
                  :root-flat="true"
                  root-text-color="dark"
                  :callback="$routerNav"
                  class="q-gutter-x-sm"
              />

            </div>

            <q-tabs
                v-model="tabState"
                active-bg-color="grey-4"
                active-color1="white"
                align="left"
                class="text-secondary border-b-11 border-grey-4 q-px-lg q-mt-md"
                dense
                indicator-color="transparent"
                narrow-indicator
                v-if="tabs.length"
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

          <div
              class="modal__content"
              @click="onMouseDown"
          >

            <div
                ref="bodyScroll"
                class="scroll-y q-py-none q-px-sm col-shrink relative-position full-height"
            >
              <div ref="body" class="">

                <slot v-bind="ctx"/>

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

            </div>

          </div>

        </template>

      </template>

    </ui-dialog>

  </div>
</template>

<script>

import SwipeableBottomSheet from "./src/components/SwipeToClose.vue";

export default {
  components: {
    SwipeableBottomSheet,
  },
  props: {
    com: {default: 'q-dialog'},

    tabs: {default: () => []},
    tab: {default: null},

    toolbar: {default: () => []},
    toolbarExclude: {default: () => []},

    context: {default: () => ({})},
    loaded: {default: true},
    value: {},
    maximized: {default: false},
    mobileSheet: {default: true},
    title: {},
    hidden: {},
    isSubView: {},
    backEnable: {default: true},

    dialogUid: {default: null},

    orderRoot: {default: false},
    orderCurrent: {default: false},
    orderIndex: {default: 0},
    order: {default: 0},

    disabled: {default: false},

    dialogMode: {default: 'dialog'},
    dialogWidth: {default: '448px'},
    dialogMaxWidth: {default: '80vw'},
    dialogMaxHeight: {default: '90vh'},
    dialogContentMaxHeight: {default: '50vh'},

    sheetContentMaxHeight: {default: '92vh'},
    sheetMaxHeight: {default: '92vh'},
    sheetHeaderEnable: {default: true},

    actionsClose: {default: false},
    actionsClosePosition: {default: 'fixed'},
    actions: {default: () => []},
    menu: {},
  },
  data() {
    return {
      size: {
        width: '1100px',
        height: '500px'
      },

      valueState: this.value,
      bodyHeight: 0,
      bodyScrollHeight: 0,

      tabState: this.tab,
      dialogWidthState: this.dialogWidth,

    }
  },
  computed: {

    zindexComp() {
      return this.order
    },

    bindSheet() {

      const res = {
        style: {
          //maxWidth: this.dialogMaxWidth,
          //maxHeight: this.dialogMaxHeight,
        },
      }

      //res.style.width = 'calc(' + this.dialogWidthState + ' - ' + this.orderIndex * 55 + 'px)'

      return res
    },

    bindCard() {

      const res = {
        style: {},
      }

      //res.style.width = 'calc(' + this.dialogWidthState + ' - ' + this.orderIndex * 55 + 'px)'

      return res
    },

    bindDialog() {
      const res = {
        position: 'standard'
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
            res.maximized = this.isMobileSheet || this.maximized
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

    dialogBodyScrollHeight() {

      return this.bodyHeight > 500 ? 500 : this.bodyHeight
    }
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

      this.$emit('input', val)
    },
  },
  methods: {


    onMouseDown() {

      this.$store.commit('router/VROUTER_SELECT', this.dialogUid)

      //this.zindex = parseInt(Date.now()/1000)
    },

    calcWidth(width) {

    },

    onResize(e, t) {

      this.size = {}

      return

      if (this.$refs.body) {
        this.bodyHeight = this.$refs.body.clientHeight
      }

      if (this.$refs.bodyScroll) {
        this.bodyScrollHeight = this.$refs.bodyScroll.$el.clientHeight
      }

    }
  },
  mounted() {

    //this.onResize();
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

.c-header {
  user-select: none;
}

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

<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  margin: 0 1rem;
  padding1: 1rem;
  border: 2px solid #e2e8f0;
  box-shadow: 2.5px 5.0px 5.0px hsl(0deg 0% 0% / 0.42);
  border-radius: 0.25rem;
  background: #fff;
}

.modal__title {
  margin: 0 0 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal__content {
  flex-grow: 1;
  overflow-y: auto;
}

.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem 0 0;
}

.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

<style scoped>
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
