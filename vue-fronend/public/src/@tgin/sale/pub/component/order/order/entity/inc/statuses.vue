<template>

  <div class="c-status-steps flex no-wrap justify-between" style="z-index: 1;position: relative;">

    <template
        v-for="(status, index) of statuses"
    >
      <div
          :class="{
            'c-status-step flex': true
          }"
      >
        <div
            :title="status.NAME"
            style="background-color1: #E6F6F2; border-radius1: 50%;"
            class="text-center"
        >

          <q-icon
              v-if="$icons['order_status_'+status.ID]"
              :name="$icons['order_status_'+status.ID]"
              :style="{
                stroke: status.COLOR_STROKE,
                fill:  'transparent',
                strokeWidth: status.STROKE_WIDTH
              }"
              class="q-mx-auto q-my-auto"
              :class="iconClass"
              :size="iconSize"
          />

          <div style="max-width:110px;" class="q-px-sm q-mt-sm s-font-xs s-font-lg-xs leading-e4" v-if="showLabels && $q.screen.gt.sm">
            {{status.NAME}}
          </div>

        </div>

      </div>

      <div
          v-if="index < statuses.length - 1"
          class="col-grow flex "
          style="position: relative"
      >
        <div
            class="c-status__line "
            style="width:100%; background-color: #eee;"
        />
        <div
            v-if="status.DONE"
            class="c-status__line "
            :style="{
              width: '100%',
              backgroundColor: status.COLOR_STROKE
            }"
        />
        <div
            v-if="status.CURRENT"
            class="c-status__line "
            :style="{
              width: '50%',
              backgroundColor: status.COLOR_STROKE
            }"
        />
      </div>

    </template>



  </div>

</template>

<script>

export default {
  props: {
    statuses: {},
    polling: {},
    iconSize: {default: null},
    iconClass: {default: ''},
    showLabels: {default: true},
  },
}
</script>

<style lang="scss" scoped>

.c-status__line {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 2px;
}

</style>
