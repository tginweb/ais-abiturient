<template>
  <div class="com-quantity">

    <q-tooltip
        v-model="tooltip"
        v-if="showActionTooltip"
        :no-parent-event="!tooltip"
        content-class="s-font-sm"
        class="c-action-tooltip bg-positive"
        :hide-delay="1100"
        anchor="bottom left"
        self="top left"
    >
      Количество товара в корзине обновлено
    </q-tooltip>

    <div
        class="flex no-wrap justify-between"
        :class="controlClass"
    >
      <q-btn
          :icon="$icons.fasMinus"
          class="q-px-xs q-py-xs --icon-only"
          :color="btnColor"
          :text-color="btnTextColor"
          dense
          :size="btnSize"
          :flat="flat"
          unelevated
          :outline="btnOutline"
          @click="onBasketQuantityDown"
      />

      <div
          class="c-input flex no-wrap items-center"
          :class="inputClass"
      >

        <input
            type="text"
            :style="{
              fontSize: inputSize,
              border: 0,
              outline: 'none'
            }"
            v-model="valueBlur"
            :size="(valueBlur+'').length + inputSizeAdd"
            class="col text-center"
            :class="inputControlClass"
            @blur="onBlur"
            @keypress="onValueInputKeypress"
            maxlength="7"
            ref="input"
        />
        <div
            class="q-mr-xs"
            :style="{
              fontSize: inputSize
            }"
            v-if="measureShow"
            @click="$refs.input.focus()"
        >
          {{ measureName }}
        </div>
      </div>

      <q-btn
          :icon="$icons.fasPlus"
          class="q-px-xs q-py-xs --icon-only"
          :color="btnColor"
          :text-color="btnTextColor"
          :flat="flat"
          dense
          :size="btnSize"
          unelevated
          :outline="btnOutline"
          @click="onBasketQuantityUp"
      />

    </div>

    <div v-if="error" class="q-mt-sm text-red s-font-sm">
      {{ error }}
    </div>

  </div>
</template>

<script>

export default {
  props: {
    value: {default: 1},
    measureRatio: {default: 1},
    measureName: {default: ''},
    measureShow: {default: true},
    inputSize: {default: '16px'},
    inputSizeAdd: {default: 0},
    flat: {flat: false},
    btnSize: {default: '16px'},
    btnColor: {default: 'primary'},
    btnTextColor: {default: null},
    btnOutline: {default: false},
    controlClass: {default: null},
    inputClass: {default: null},
    inputControlClass: {default: null},

    showActionTooltip: {default: false},
  },
  components: {},
  data() {
    return {
      valueState: null,
      valueBlur: null,
      error: '',
      tooltip: false
    }
  },
  created() {
    const val = this.normalizeValue(this.value || this.measureRatio);
    this.valueState = val
    this.valueBlur = val
  },
  computed: {

    valueInput: {
      get: function () {
        return this.valueState ? this.normalizeValue(this.valueState) : 0
      },
      set: function (val) {
        this.valueState = this.normalizeValue(val)
        this.$emit('input', this.valueState)

        this.tooltip = true
      }
    },

    measureRatioDights() {
      if (Math.floor(this.measureRatio) === this.measureRatio) return 0;
      return this.measureRatio.toString().split(".")[1].length || 0;
    },
  },
  methods: {
    normalizeValue(val) {
      return Number(parseFloat(val).toFixed(this.measureRatioDights))
    },
    onBlur() {
      if (parseFloat(this.valueBlur) === 0) {
        this.error = null
        this.valueInput = 0
        return
      }
      if (!this.error)
        this.valueInput = this.valueBlur
    },
    onValueInputKeypress(e) {
      const charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
      const charStr = String.fromCharCode(charCode);

      if (this.measureRatio === 1) {
        if (!/[\d]/.test(charStr)) {
          e.preventDefault();
        }
      } else {
        if (!/[\d\.]/.test(charStr)) {
          e.preventDefault();
        }
      }

    },
    onBasketQuantityDown() {
      this.valueInput = parseFloat(this.valueState) - parseFloat(this.measureRatio)

      if (this.valueInput < 0) this.valueInput = 0
    },
    onBasketQuantityUp() {
      this.valueInput = parseFloat(this.valueState) + parseFloat(this.measureRatio)
    }
  },
  watch: {
    valueBlur(val) {
      this.error = '';
      if (parseFloat(val) < parseFloat(this.measureRatio)) {
        this.error = 'Количество меньше минимального'
      } else if (parseFloat(val) > 500) {
        this.error = 'Количество больше максимального'
      }
    },
    value(val) {
      const nval = this.normalizeValue(val)
      this.valueState = nval
      this.valueBlur = nval
    }
  }
}
</script>

<style lang="scss" scoped>

.c-input {
  min-height: 100%;

  .bordered {
    border-top: 1px solid #2C2C75FF;
    border-bottom: 1px solid #2C2C75FF;
    margin: 0 -2px 0 -2px;
    padding: 0 3px;
  }
}

.c-action-tooltip {
  max-width: 150px;
}


</style>
