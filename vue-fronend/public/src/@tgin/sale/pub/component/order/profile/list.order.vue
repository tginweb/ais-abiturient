<template>
  <div class="com">

    <ui-options
        :value="tab"
        v-if="allowCustom"
        @input="onTabChange"
        :options="[
            {VALUE: 'profile', NAME: 'Адрес из профиля'},
            {VALUE: 'custom', NAME: 'Другой адрес'},
        ]"
        optionLabel="NAME"
        optionValue="VALUE"
        class="q-mb-md"
    />

    <template v-if="valueState !== 'custom'">

      <q-select
          class=""
          v-model="valueState"
          label1="Ваш адрес доставки"
          :options="itemsOptions"
          map-options
          emit-value
          option-label="NAME"
          option-value="ID"
          outlined
          ref="input"
          v-if="!listMode"
      >
        <template v-slot:selected-item="scope">

          <q-item v-if="scope.opt.ID === 'custom'" dense class="q-px-none q-py-none">
            <q-item-section>
              <q-item-label class="text-dark">
                {{ scope.opt.NAME }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-else class="q-px-none">
            <CProfile :item="scope.opt" class=""/>
          </q-item>

        </template>
        <template v-slot:option="scope">

          <q-item
              v-if="scope.opt.ID === 'custom'"
              clickable
              @click="valueState = scope.opt.ID, $refs.input.hidePopup()"
          >
            <q-item-section>
              <q-item-label class="text-dark">
                {{ scope.opt.NAME }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
              v-else
              v-bind="scope.itemProps"
              clickable
              @click="valueState = scope.opt.ID, $refs.input.hidePopup()"
          >
            <CProfile :item="scope.opt"/>
          </q-item>

        </template>
        <template v-slot:append="scope">

          <q-btn
              :icon="$icons.pencil"
              class="q-px-none full-width-lt-sm full-width "
              color="primary"
              text-color="primary"
              dense
              flat
              @click.stop="onEdit(selectedItem)"
              v-if="selectedItem"
          />
        </template>

      </q-select>

      <q-list
          v-else
          class="c-options border-primary-brown-gray-1 border-1 border-radius-xs"
      >
        <template
            v-for="(item, index) of items"
        >

          <q-item
              :key="item.ID"
              v-ripple
              class="q-px-none q-py-sm q-px-sm q-px-md-md q-py-md-md border-b-1 border-primary-brown-gray-1 border-b-last-0"
              manual-focus
              tag="label"
          >

            <q-item-section class="col-auto">
              <q-radio
                  v-model="valueState"
                  :val="item.ID"
                  color="primary"
              />
            </q-item-section>

            <CProfile
                :item="item"
                :show-person-type="showPersonType"
                :show-company="showCompany"
                class=""
            />

            <q-item-section top class="q-ml-auto col-auto ">

              <q-item-label class="text-right flex no-wrap q-gutter-sm">

                <q-btn
                    :icon="$icons.pencil"
                    dense
                    flat
                    @click="onEdit(item)"
                    no-wrap
                    color="primary"
                />

              </q-item-label>
            </q-item-section>

          </q-item>
        </template>

      </q-list>
    </template>


  </div>

</template>

<script>

import CParent from "./list";

export default {
  extends: CParent,
  props: {
    allowNewItem: {},
    allowCustom: {default: true},
    listMode: {default: false},
  },
  data() {
    return {
      valueState: this.value,
    }
  },
  methods: {
    onChangeToProfile() {
      if (this.items.length) {
        this.valueState = this.items[0]['ID']
      }
    },

    onTabChange(v) {
      if (v === 'custom') {
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
