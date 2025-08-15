<template>

  <div class="com s-info-section">

    <div class="__header" style="font-weight: 800;">Контакты</div>

    <div class="row q-col-gutter-x-lg q-col-gutter-y-sm ">

      <div class="col-24 col-sm-12">

        <q-input
            :rules="[
              val => !!val || 'Обязательное поле'
            ]"
            label="Телефон 1"
            mask="+# (###) ### - ######"
            outlined
            unmasked-value
            lazy-rules
            v-model="dataPersonal.phone"
            :readonly="readnonly"
        />

      </div>

      <div class="col-24 col-sm-12">

        <q-input
            label="Телефон 2"
            mask="+# (###) ### - ######"
            outlined
            lazy-rules
            unmasked-value
            v-model="dataPersonal.phone2"
            :readonly="readnonly"
        />

      </div>

      <div class="col-24 col-sm-12">

        <q-input
            :rules="[
              val => !!val || 'Обязательное поле',
              val => $util.validate.checkEmail(val) || 'Неверный формат'
            ]"
            label="E-mail"
            lazy-rules
            outlined
            v-model="dataPersonal.email"
            :readonly="readnonly"
        />

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
          phone: this.dataPersonal.phone,
          phone2: this.dataPersonal.phone2,
          email: this.dataPersonal.email,
      }
    }
  },

}
</script>

<style lang="sass" scoped>

</style>
