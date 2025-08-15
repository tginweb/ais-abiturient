<template>

  <CWrapper
      :can-save="true"
      @next="onNext"
      @save="onSave"
  >


    <q-form
        ref="form"
        @submit="onSave"
    >

      <div class="row q-col-gutter-md q-mb-md">

        <div class="col-24 col-sm-8">

          <q-input
              v-model="dataPersonal.lastName"
              :rules="[val => !!val || 'Обязательное поле']"
              label="Фамилия"
              outlined
          />

        </div>

        <div class="col-24 col-sm-8">

          <q-input
              v-model="dataPersonal.firstName"
              :rules="[val => !!val || 'Обязательное поле']"
              label="Имя"
              outlined
          />

        </div>

        <div class="col-24 col-sm-8">

          <q-input
              v-model="dataPersonal.secondName"
              label="Отчество"
              outlined
          />

        </div>

      </div>

      <div class="row q-col-gutter-md q-mb-md">

        <div class="col-24 col-sm-12">

          <ui-input-date
              v-model="dataPersonal.birthday"
              :required="true"
              label="Дата рождения"
              outlined
          />

        </div>

        <div class="col-24 col-sm-12">

          <q-option-group
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
              :rules="[val => !!val || 'Небходимо выбрать пол']"
              color="primary"
              inline
          />


        </div>

      </div>

      <div class="row q-col-gutter-md q-mb-md">

        <div class="col-24 col-sm-12">

          <q-input
              v-model="dataPersonal.birthplace"
              :rules="[val => !!val || 'Обязательное поле']"
              label="Место рождения"
              outlined
          >
          </q-input>
        </div>

        <div class="col-24 col-sm-12">

          <q-select
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
              label="Гражданство"
              map-options
              outlined
              use-input
          />

        </div>

      </div>

      <div class="row q-col-gutter-md q-mb-md">

        <div v-if="dataPersonal.citizenship=='other'" class="col-24">

          <q-select
              v-model="dataPersonal.citizenshipCountry"
              :options="$store.getters['edu_country/options']"
              :rules="[val => !!val || 'Обязательное поле']"
              emit-value
              label="Страна гражданства"
              map-options
              option-label="name"
              option-value="id"
              outlined
          />

        </div>

        <template v-else>
          <div class="col-24 col-sm-12">

            <q-input
                v-model="dataPersonal.inn"
                :rules="[
                val => !!val || 'Обязательное поле',
                val => val.length===12 || 'Длина поля должна быть 12 символов'
              ]"
                label="ИНН"
                lazy-rules
                outlined
            />

          </div>

          <div class="col-24 col-sm-12">

            <ui-input-snils
                v-model="dataPersonal.snils"
                :disable="snilsReadonly"
                :hint="snilsReadonly ? 'указан при регистрации' : null"
                :required="true"
                label="СНИЛС"
                lazy-rules
                outlined
            />

          </div>
        </template>

        <div class="col-24 col-sm-12">
          <q-select
              v-model="compNeedFlat"
              :options="[
                {value: 'false', label: 'нет'},
                {value: 'true', label: 'да'},
              ]"
              :rules="[val => !!val || 'Обязательное поле']"
              emit-value
              label="Нуждаюсь в общежитии"
              map-options
              outlined
          />
        </div>
      </div>

      <q-separator class="q-my-lg"/>

      <h6 class="q-mb-md q-mt-md">Документы удостоверяющие личность</h6>

      <edu-doc-public-embed
          :is-foreigner="dataPersonal.citizenship !== 'russia'"
          :items="storeOrder.docs"
          :order="storeOrder"
          doc-role="passport"
          @changed="refetchDocs"
      />

    </q-form>

  </CWrapper>

</template>

<script>

import CBase from './_base'
import CWrapper from './_wrapper'

export default {
  extends: CBase,
  components: {
    CWrapper
  },
  data() {
    return {
      canSave: true,

    }
  },
  methods: {

    getSaveQuery() {
      return {
        mutation: require('~module/edu-org/modules/order/gql/order/mutation/old/section_update.gql'),
        variables: {
          section: 'personal',
          data: {
            citizenship: this.dataPersonal.citizenship,
            citizenshipCountry: this.dataPersonal.citizenshipCountry,
            firstName: this.dataPersonal.firstName,
            lastName: this.dataPersonal.lastName,
            secondName: this.dataPersonal.secondName,
            inn: this.dataPersonal.inn,
            snils: this.dataPersonal.snils,
            birthday: this.dataPersonal.birthday,
            birthplace: this.dataPersonal.birthplace,
            gender: this.dataPersonal.gender,
            needFlat: this.dataPersonal.needFlat,
          },
        },
      }
    }
  },
  computed: {
    dataPersonal() {
      return this.orderData.anket.personal
    },
    snilsReadonly() {
      return !!this.$store.getters['user/user'].snils
    },
    compNeedFlat: {
      get: function () {
        return (typeof this.dataPersonal.needFlat == 'boolean') ? (this.dataPersonal.needFlat ? 'true' : 'false') : ''
      },
      set: function (val) {
        this.dataPersonal.needFlat = (val === 'true' ? true : false)
      }
    }
  }
}
</script>


<style lang="sass" scoped>


</style>
