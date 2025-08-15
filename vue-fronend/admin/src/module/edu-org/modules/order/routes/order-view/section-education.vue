<template>

  <div class="com s-info-section">

    <div class="__header" style="font-weight: 800;">Образование</div>

    <div class="row q-col-gutter-md">

      <div class="col-24">
        <q-select
            :options="$store.getters['edu_level/options']"
            :rules="[val => !!val || 'Обязательное поле']"
            emit-value
            label="Уровень предыдущего образования"
            map-options
            option-label="name_ak"
            option-value="id"
            outlined
            :readonly="readnonly"
            v-model="dataEducation.prevEduLevel"
        />
      </div>

      <div v-if="orderData.eduTypeSlug=='mag' || orderData.eduTypeSlug=='asp'" class="col-24">

        <q-input
            v-model="dataEducation.specialty"
            :readonly="readnonly"
            :rules="[val => !!val || 'Обязательное поле']"
            label="По направлению (специальности)"
            outlined
        >
        </q-input>

      </div>

      <div class="col-24">

        <q-select
            v-model="dataEducation.docCountryType"
            :options="[
                {
                  label: 'РФ',
                  value: 'russia'
                },
                {
                  label: 'Другая страна',
                  value: 'other'
                },
              ]"
            :readonly="readnonly"
            :rules="[val => !!val || 'Обязательное поле']"
            emit-value
            label="Обр-ие получено в"
            map-options
            outlined
        />

      </div>
      <div class="col-24">

        <ui-input-address
            v-if="dataEducation.docCountryType!=='other'"
            v-model="dataEducation.docCity"
            :readnonly="readnonly"
            :valueData="true"
            fromBound="region"
            label="Регион, город (нас. пункт) где получен документ"
            outlined
            toBound="settlement"
        />

        <q-input
            v-else
            v-model="dataEducation.docCity.name"
            label="Страна, регион, город где получено образование"
            outlined
        />

      </div>


      <div v-if="orderData.eduTypeSlug=='mag'" class="col-24">

        <q-checkbox
            v-model="dataEducation.irnituEdu2020"
            :disable="readnonly"
            :false-value="null"
            label="Выпускник ИРНИТУ 2021 года"
        ></q-checkbox>

        <div v-if="dataEducation.irnituEdu2020" class="text-red-6 q-mx-md">Для выпускников ИРНИТУ этого года можно не
          указывать серию, номер, дату выдачи и скан диплома
        </div>

      </div>

      <div class="col-24 col-sm-12">

        <q-select
            v-model="dataPersonal.languages"
            :options="[...$store.getters['edu_language/items'], ...{id: 100, name: 'другой язык'}]"
            emit-value
            label="Знание иностранных языков"
            map-options
            multiple
            option-label="name"
            option-value="id"
            outlined
            :readnonly="readnonly"
        />

      </div>

      <div v-if="dataPersonal.languages.indexOf(100) > -1" class="col-24 col-sm-12">

        <q-input
            v-model="dataPersonal.languageCustom"
            label="Другой язык"
            :readnonly="readnonly"
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
        prevEduLevel: this.dataEducation.prevEduLevel,

        docCountryType: this.dataEducation.docCountryType,
        docCity: this.dataEducation.docCity,

        irnituEdu2020: this.dataEducation.irnituEdu2020,
        specialty: this.dataEducation.specialty,

        languages: this.dataPersonal.languages,
        languageCustom: this.dataPersonal.languageCustom,
      }
    }
  },

}
</script>

<style lang="sass" scoped>

</style>
