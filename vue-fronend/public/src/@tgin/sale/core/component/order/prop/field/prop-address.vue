<template>
  <div class="com">

    <ui-input-address
        :label="label"
        :loading="loading"
        v-bind="bindLocationProps"
        :readonly="readonly"
        :rules="rulesExt"
        :value="valueState"
        :outlined="outlined"
        :hint="hint"
        @changeData="onChangeData"
        @popup-show="onPopupShow"
        @popup-hide="onPopupHide"
    >
      <template v-if="$slots.append" v-slot:append>
        <slot name="append"/>
      </template>
    </ui-input-address>

  </div>
</template>

<script>

import CProp from './prop-base'

export default {
  extends: CProp,
  data() {
    return {
      houseSelected: null,
    }
  },
  methods: {
    onPopupHide() {
      const dialog = document.querySelector('.q-dialog__inner--top')

      if (dialog) {
        dialog.classList.remove("--select-popup");
      }
    },

    onPopupShow() {

      if (this.$q.screen.gt.md) return

      setTimeout(() => {

        const dialog = document.querySelector('.q-dialog__inner--top')

        if (dialog) {
          dialog.parentElement.classList.add("--select-popup");
        }

      }, 30)

      setTimeout(() => {

        const input = document.querySelector('.q-dialog .c-address-input')

        if (input) {
          if (window.getSelection) {
            window.getSelection().removeAllRanges();
          } else if (document.selection) {
            document.selection.empty();
          }
          input.setSelectionRange(1000, 1000);
        }

      }, 100)


    },

    onValueStateChange(val) {
      //this.$emit('input', val)
      //this.$emit('change', val)
    },

    onChangeData(val, data) {

      this.houseSelected = !!data.house

      if (!data.house) {
        return
      }

      this.$emit('change', val)

      const propsValuesByRole = {}

      if (data.city) {
        propsValuesByRole['CITY'] = data.city
      }

      if (data.postal_code) {
        propsValuesByRole['ZIP'] = data.postal_code
      }

      if (data.geo_lat) {
        propsValuesByRole['COORDINATES'] = data.geo_lat + ':' + data.geo_lon
      }

      if (data.flat) {
        propsValuesByRole['FLAT'] = data.flat
      }

      //this.onPropChange(this.prop.ID, val)
      this.propsUpdate(propsValuesByRole);
    }
  },
  computed: {
    bindLocationProps() {
      return this.$store.getters['storeMap']('saleInputAddressProps', {})
    },
    rulesExt() {

      const rules = this.rules.slice()

      rules.unshift(val => this.houseSelected === null || this.houseSelected === true || 'Не выбран дом')

      return rules
    },

    locationOptions() {
      return this.$store.state.sale.defaultLocations && this.$store.state.sale.defaultLocations.map(item => ({
        value: item.CODE,
        label: item.NAME,
      }))
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
