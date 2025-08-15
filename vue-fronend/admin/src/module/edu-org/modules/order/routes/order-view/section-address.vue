<template>

  <div class="com s-info-section">

    <div class="__header" style="font-weight: 800;">Адрес</div>

    <div class="row q-col-gutter-md q-mb-lg">

      <div class="col-24">

        <div class="flex">

          <div class="col-grow">

            <ui-input-address
                :rules="[
                  val => !!val || 'Обязательное поле',
                  val => !!dataPersonal.addressReg.custom || !!dataPersonal.addressReg.house || 'Неполный адрес'
                ]"
                :valueData="true"
                label="Адрес регистрации"
                outlined
                :readonly="readnonly"
                v-model="dataPersonal.addressReg"
                v-if="!dataPersonal.addressReg.custom"
            />

            <q-input
                label="Адрес регистрации"
                outlined
                v-model="dataPersonal.addressReg.name"
                v-if="dataPersonal.addressReg.custom"
            ></q-input>
          </div>

          <q-checkbox
              label="Указать вручную"
              v-model="dataPersonal.addressReg.custom"
              :false-value="null"
              :disable="readnonly"
          />

        </div>

      </div>

      <div class="col-24">
        <q-checkbox
            label="Адрес проживания совпадает с адресом регистрации"
            v-model="dataPersonal.addressEqual"
            :disable="readnonly"
        />
      </div>

      <div class="col-24"  v-if="!dataPersonal.addressEqual">

        <div class="flex">

          <div class="col-grow">
            <ui-input-address
                :rules="[
                  val => !!val || 'Обязательное поле',
                  val => !!dataPersonal.addressLive.custom || !!dataPersonal.addressLive.house || 'Неполный адрес'
                ]"
                :valueData="true"
                label="Адрес проживания"
                outlined
                :readonly="readnonly"
                v-model="dataPersonal.addressLive"
                v-show="!dataPersonal.addressLive.custom"
            />

            <q-input
                label="Адрес проживания"
                outlined
                v-model="dataPersonal.addressLive.name"
                v-if="dataPersonal.addressLive.custom"
                :readonly="readnonly"
            />

          </div>

          <q-checkbox
              label="Указать вручную"
              v-model="dataPersonal.addressLive.custom"
              :false-value="null"
              :disable="readnonly"
          />

        </div>

      </div>

    </div>


  </div>

</template>

<script>

import CParent from './section'

export default {
  extends: CParent,
  methods: {
    getSaveFields() {
      return {
        addressLive: this.dataPersonal.addressLive,
        addressReg: this.dataPersonal.addressReg,
        addressEqual: this.dataPersonal.addressEqual,
      }
    }
  },

}
</script>

<style lang="sass" scoped>

</style>
