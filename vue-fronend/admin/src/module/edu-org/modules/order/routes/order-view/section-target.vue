<template>

  <div class="com s-info-section">

    <div class="__header" style="font-weight: 800;">Целевое направление</div>

    <div class="row q-col-gutter-md ">

      <div class="col-24">

        <q-select
            v-model="dataEntrance.targetHave"
            :options="[
                  {value: null, label: ''},
                  {value: false, label: 'нет'},
                  {value: true, label: 'да'},
                ]"
            :readonly="readnonly"
            :rules="[val => typeof val === 'boolean' || 'Обязательное поле']"
            emit-value
            label="Имею договор"
            map-options
            outlined
        />

      </div>

      <div class="col-24" v-if="dataEntrance.targetHave">

        <q-input
            v-model="dataEntrance.targetOrganization"
            label="Организация"
            :rules="[val => !!val || 'Обязательное поле']"
            outlined
        />

      </div>

      <div class="col-24" v-if="dataEntrance.targetHave">

        <q-input
            v-model="dataEntrance.targetDogovor"
            label="Номер договора"
            :rules="[val => !!val || 'Обязательное поле']"
            outlined
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
        targetHave: this.dataEntrance.targetHave,
        targetOrganization: this.dataEntrance.targetOrganization,
        targetDogovor: this.dataEntrance.targetDogovor,
      }
    }
  },

}
</script>

<style lang="sass" scoped>

</style>
