<template>

  <div class="">

    <q-linear-progress
        size="25px"
        :value="val"
        :style="{
          color: color
        }"
    >
      <div class="absolute-full flex flex-center">
        <q-badge color="white" text-color="accent" :label="row.NEED_DELTA"/>
      </div>
    </q-linear-progress>

  </div>

</template>

<script>
import colorGradient from "javascript-color-gradient";

export default {
  props: {
    row: {},
  },
  computed: {

    color() {


      return this.colors.getColor(this.row.NEED_DELTA);
    },

    colors() {
      let cnt = 120 - 40
      if (cnt <= 0) cnt = 1
      return colorGradient
          .setGradient("#45bd56", "#be1b00")
          .setMidpoint(cnt)
    },

    val() {


      return this.row.NEED_DELTA ? (this.row.NEED_DELTA / 100) : 0
    },
    percent() {
      return parseInt(this.val * 100) + '%'
    },
  }
}
</script>

<style lang="scss" scoped>


</style>
