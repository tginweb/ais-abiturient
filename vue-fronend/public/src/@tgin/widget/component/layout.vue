<template>

  <div>


    <smart-widget-grid
        :layout="layout"
        @layout-updated="onLayoutUpdated"
    >

      <smart-widget
          :title="widget.NAME"
          v-for="(widget, index) in widgetsState"
          :key="widget.CODE"
          :slot="index"
          fixedHeight
          :class="widget.CLASS"
          class="c-widget"
          :ref="index"
      >
        <q-resize-observer @resize="onResize(index, $event)"/>

        <template slot="toolbar">
          <div style="">

            <q-btn
                v-for="(item, index) in widget.data.toolbarMenu"
                :key="index"
                :label="item.label"
                :icon="item.icon"
                flat
                @click="item.callback"
            />

          </div>
        </template>

        <component
            :is="widget.COMPONENT"
            :height="widget.size.height"
            :widgetData.sync="widget.data"
        >
        </component>

      </smart-widget>

    </smart-widget-grid>

  </div>

</template>
<script>


export default {
  props: {
    layout: {},
    widgets: {}
  },
  data() {
    return {
      widgetsState: this.widgets.map(item => this.prepareWidget(item)),
      layoutState: this.layout
    }
  },
  computed: {

    widgetsComp() {
      return this.widgetsState.map(widget => {
        return {
          ...widget
        }
      })
    }
  },
  methods: {
    toolbarMenu(item) {
      return this.widgetsState[item].MENU
    },
    prepareWidget(item) {
      return {
        ...item,
        size: {},
        data: {}
      }
    },
    onResize(index, size) {
      this.widgetsState[index].size = size
    },
    onLayoutUpdated(state) {

      this.layoutState = state
    }
  }
}
</script>
<style lang="scss" scoped>
.c-widget {

  /deep/ {

    .widget-header {
      background-color: $secondary;
      color: #fff;

      svg {
        color: #fff !important;
        fill: #fff !important;
      }
    }

    .widget-header__title {
      span {

      }
    }
  }

  &.no-padding {
    /deep/ .widget-body__content {
      padding: 0 !important;
    }
  }
}
</style>
