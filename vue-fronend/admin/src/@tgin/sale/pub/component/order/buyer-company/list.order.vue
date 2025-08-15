<template>
  <div >

    <q-select
        class="q-mt-md"
        v-if="valueState !== 'custom'"
        v-model="valueState"
        label1="Ваш адрес доставки"
        :options="itemsOptions"
        map-options
        emit-value
        option-label="NAME"
        option-value="ID"
        outlined
        ref="input"
    >
      <template v-slot:selected-item="scope">

        <q-item class="q-px-none">
          <CItem :item="scope.opt" class=""/>
        </q-item>

      </template>
      <template v-slot:option="scope">

        <q-item
            v-bind="scope.itemProps"
            clickable
            @click="valueState = scope.opt.ID, $refs.input.hidePopup()"
        >
          <CItem :item="scope.opt"/>
        </q-item>

      </template>
      <template v-slot:append="scope">

      </template>

    </q-select>

  </div>

</template>

<script>

import CParent from "./list";

export default {
  extends: CParent,
  props: {
    allowNewItem: {},
  },
  data() {
    return {

    }
  },
  methods: {
    onChangeToProfile() {
      if (this.items.length) {
        this.valueState = this.items[0]['ID']
      }
    },

    onTabChange(v) {
      if (v==='custom') {
        this.valueState = 'custom'
      } else {
        this.onChangeToProfile()
      }
    }
  },
  computed: {
    tab() {
      return this.valueState === 'custom' ? 'custom' : 'profile'
    },

    itemsOptions() {
      const options = this.items

      /*
      options.push({
        'ID': 'custom',
        'NAME': 'указать другой адрес',
      })
       */

      return options
    },
    openContext() {
      return {
        name: 'vorder'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.c-options {
  margin-left1: -10px;
}

.c-option {

}

.item {

  &.selected {
    background: #eee;
  }
}

/deep/ {
  .q-tab__icon {
    font-size: 16px;
  }
  .q-tab__label {
    font-size: inherit;
  }
}

</style>
