<template>

  <div class="com s-info-section">

    <div class="__header" style="font-weight: 800;">Персональные данные</div>

    <div class="q-gutter-y-md">

      <div>

        <div class="row q-col-gutter-md">

          <div class="col-24 col-sm-8">

            <q-input
                v-model="dataPersonal.lastName"
                :readonly="readnonly"
                :rules="[val => !!val || 'Обязательное поле']"
                label="Фамилия"
                outlined
            >
            </q-input>

          </div>

          <div class="col-24 col-sm-8">

            <q-input
                v-model="dataPersonal.firstName"
                :readonly="readnonly"
                :rules="[val => !!val || 'Обязательное поле']"
                label="Имя"
                outlined
            >
            </q-input>

          </div>

          <div class="col-24 col-sm-8">

            <q-input
                v-model="dataPersonal.secondName"
                :readonly="readnonly"
                label="Отчество"
                outlined
            />

          </div>

        </div>
      </div>

      <div>
        <div class="row q-col-gutter-md">

          <div class="col-24 col-sm-12">

            <ui-input-date
                v-model="dataPersonal.birthday"
                :readonly="readnonly"
                :required="true"
                label="Дата рождения"
                outlined
            />

          </div>

          <div class="col-24 col-sm-12">

            <q-input
                v-model="dataPersonal.birthplace"
                :readonly="readnonly"
                :rules="[val => !!val || 'Обязательное поле']"
                label="Место рождения"
                outlined
            >
            </q-input>

          </div>

        </div>
      </div>

      <div>
        <div class="row q-col-gutter-md">

          <div class="col-24 col-sm-12">

            <q-select
                v-model="dataPersonal.gender"
                :options="[
              {
                label: 'мужской',
                value: 'male'
              },
              {
                label: 'женский',
                value: 'female'
              },
            ]"
                label="Пол"
                outlined
                :readonly="readnonly"
                :rules="[val => !!val || 'Небходимо выбрать пол']"
                color="primary"
                emit-value
                map-options
            />

          </div>

          <div class="col-24 col-sm-12">

            <q-select
                label="Гражданство"
                :readonly="readnonly"
                v-model="dataPersonal.citizenship"
                :options="[
                  {
                    label: 'Россиянин',
                    value: 'russia'
                  },
                  {
                    label: 'Житель СНГ',
                    value: 'sng'
                  },
                  {
                    label: 'Иностранец',
                    value: 'other'
                  },
                  {
                    label: 'Соотечественник',
                    value: 'compatriot'
                  },
                ]"
                :rules="[val => !!val || 'Обязательное поле']"
                emit-value
                map-options
                outlined
            />

          </div>

          <div v-if="dataPersonal.citizenship!=='russia'" class="col-24">

            <q-select
                v-model="dataPersonal.citizenshipCountry"
                :options="$store.getters['edu_country/options']"
                :readonly="readnonly"
                :rules="[val => !!val || 'Обязательное поле']"
                emit-value
                label="Страна гражданства"
                map-options
                option-label="name"
                option-value="id"
                outlined
            />

          </div>
        </div>
      </div>

      <div v-if="dataPersonal.citizenship!=='other'">
        <div class="row q-col-gutter-md">

          <div class="col-24 col-sm-12">

            <q-input
                v-model="dataPersonal.inn"
                :readonly="readnonly"
                :rules="dataPersonal.citizenship === 'russia' ? [
                  val => !val || val.length===12 || 'Длина поля должна быть 12 символов'
                ] : []"
                label="ИНН"
                lazy-rules
                outlined
            />

          </div>

          <div class="col-24 col-sm-12">

            <ui-input-snils
                v-model="dataPersonal.snils"
                :readonly="readnonly"
                :required="dataPersonal.citizenship === 'russia'"
                label="СНИЛС"
                lazy-rules
                outlined
            />

          </div>

        </div>
      </div>

      <div>
        <div class="row q-col-gutter-sm q-mt-lg">
          <div class="col-24 col-sm-12">
            <q-select
                v-model="dataPersonal.needFlat"
                :options="[
                  {value: null, label: ''},
                  {value: false, label: 'нет'},
                  {value: true, label: 'да'},
                ]"
                :rules="[val => typeof val === 'boolean' || 'Обязательное поле']"
                :readonly="readnonly"
                emit-value
                label="Нуждаюсь в общежитии"
                map-options
                outlined
            />
          </div>
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
        inn: this.dataPersonal.inn,
        snils: this.dataPersonal.snils,
        citizenship: this.dataPersonal.citizenship,
        citizenshipCountry: this.dataPersonal.citizenshipCountry,
        firstName: this.dataPersonal.firstName,
        lastName: this.dataPersonal.lastName,
        secondName: this.dataPersonal.secondName,
        birthday: this.dataPersonal.birthday,
        birthplace: this.dataPersonal.birthplace,
        gender: this.dataPersonal.gender,
        needFlat: this.dataPersonal.needFlat,
      }
    }
  },
}
</script>

<style lang="sass" scoped>

</style>
