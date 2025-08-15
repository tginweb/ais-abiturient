<template>
  <div>

    <q-dialog
        v-model="valueState"
        v-bind="bindDialog"
        :content-class="{
          'ui-dialog': true,
          ['--mode-' + (isMobileSheet ? 'sheet':'dialog')]: true
        }"
        :seamless="nested || hidden"
        @hide="$emit('hide')"
    >
      <q-resize-observer @resize="onResize"/>

      <SwipeableBottomSheet v-if="isMobileSheet" v-model="valueState">

        <q-card :style="{maxHeight: sheetMaxHeight}" class="sheet-contents no-wrap column">

          <q-card-section class="q-pt-lg">


            <div class="c-dragger" style="position: absolute; left: 0; top: 0; width: 100%;">
              <div class="c-dragger__line"></div>
            </div>

            <div v-if="sheetHeaderEnable" class="flex col-shrink items-center no-wrap">

              <q-btn
                  v-if="(isSubView || backEnable) && (!actionsClose || true)"
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

            </div>

          </q-card-section>

          <q-card-section
              :style1="{maxHeight: sheetContentMaxHeight}"
              class="scroll col-shrink q-pt-none q-pb-md"
              ref="bodyScroll"
          >
            <div ref="body">

              <slot name="head"/>

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

              <slot/>

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

            <slot name="bottom"/>

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

      </SwipeableBottomSheet>

      <q-card
          v-else
          :style="{
            width: dialogWidth,
            maxWidth: dialogMaxWidth,
            maxHeight: dialogMaxHeight
          }"
          class="dialog-contents no-wrap column"
      >
        <div
            v-if="disabled"
            style="height: 100%; width:100%; background-color: rgba(0,0,0,0.3); position: absolute; left: 0; top: 0;"
        />

        <ui-progress-inner-loading
          v-model="loading"
        />

        <template>

          <q-card-section
              v-if="title"
              class="flex q-px-lg no-wrap"
          >

            <q-btn
                v-if="isSubView"
                :icon="$icons.chevronLeft"
                class="q-mr-md"
                color="primary-brown-1"
                round
                size="sm"
                text-color="dark"
                unelevated
                @click="valueState=false"
            />

            <div class="s-font-xxl text-weight-bold">{{ title }}</div>

            <div class="q-ml-auto">
              <q-btn
                  :icon="$icons.close"
                  class=""
                  color="primary-brown-1"
                  round
                  size="sm"
                  text-color="dark"
                  unelevated
                  @click="valueState=false"
              />
            </div>

          </q-card-section>

          <q-card-section
              ref="bodyScroll"
              class="scroll-y q-py-none q-px-lg col-shrink relative-position"
          >
            <div ref="body" class="q-pb-sm1">
              <q-resize-observer @resize="onResize"/>

              <slot name="head"/>

              <slot/>

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

          <div v-if="(bodyHeight - 40) > bodyScrollHeight " class="relative-position">
            <div class="c-scroll-gradient" style="">
            </div>
          </div>

          <q-card-section class="col-auto ">

            <slot name="bottom"/>

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
    loading: {default: false},
    value: {},
    maximized: {default: false},
    mobileSheet: {default: true},
    title: {},
    hidden: {},
    isSubView: {},
    backEnable: {default: true},

    current: {default: false},
    nested: {default: false},
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
      valueState: this.value,
      bodyHeight: 0,
      bodyScrollHeight: 0
    }
  },
  computed: {

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
    value(val) {
      this.valueState = val
    },
    valueState(val) {

      this.$emit('input', val)
    },
  },
  methods: {
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
