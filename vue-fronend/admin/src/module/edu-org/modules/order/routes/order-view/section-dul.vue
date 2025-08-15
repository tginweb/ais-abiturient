<template>

  <div class="com s-info-section">

    <div class="__header" style="font-weight: 800;">Документ удостоверяющий личность</div>

    <div class="q-gutter-y-md">

      <div class="row q-col-gutter-md">

        <div class="col-24 col-sm-12">

          <q-input
              v-model="dataPersonal.doc.serial"
              :readonly="readnonly"
              :rules="[val => !!val || 'Обязательное поле']"
              label="Серия документа"
              lazy-rules
              outlined
          />

        </div>

        <div class="col-24 col-sm-12">

          <q-input
              v-model="dataPersonal.doc.number"
              :readonly="readnonly"
              :rules="[val => !!val || 'Обязательное поле']"
              label="Номер документа"
              lazy-rules
              outlined
          />

        </div>

      </div>
    </div>

  </div>

</template>

<script>

import CParent from "./section";

export default {
  extends: CParent,
  methods: {

    getSaveFields() {
      return {
        serial: this.dataPersonal.doc.serial,
        number: this.dataPersonal.doc.number,
      }
    }
  },
}
</script>

<style lang="sass" scoped>

</style>
