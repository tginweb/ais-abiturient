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

      <div class="row q-col-gutter-sm q-mb-lg">

        <div class="col-24">
          <q-select
              v-model="dataEducation.prevEduLevel"
              :options="$store.getters['edu_level/options']"
              :rules="[val => !!val || 'Обязательное поле']"
              emit-value
              label="Уровень предыдущего образования"
              map-options
              option-label="name_ak"
              option-value="id"
              outlined
          />
        </div>

        <div v-if="orderData.eduTypeSlug=='mag' || orderData.eduTypeSlug=='asp'" class="col-24">

          <q-input
              v-model="dataEducation.specialty"
              :rules="[val => !!val || 'Обязательное поле']"
              label="По направлению (специальности)"
              outlined
          >
          </q-input>

        </div>

        <div class="col-24">

          <div class="flex items-center q-mb-md">
            <div>
              Образование получено в
            </div>
            <q-option-group
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
                color="primary"
                inline
            />
          </div>

          <ui-input-address
              v-if="dataPersonal.citizenship!=='other' && dataEducation.docCountryType!=='other'"
              v-model="dataEducation.docCity"
              :rules="[val => !!val || 'Обязательное поле']"
              :valueData="true"
              fromBound="region"
              label="Регион, город (нас. пункт) где получен документ"
              outlined
              toBound="settlement"
          />

          <q-input
              v-else
              v-model="dataEducation.docCity.name"
              :rules="[val => !!val || 'Обязательное поле']"
              label="Страна, регион, город (нас. пункт) где получено образование"
              outlined
          ></q-input>

        </div>

        <div v-if="orderData.eduTypeSlug=='mag'" class="col-24">

          <q-checkbox
              v-model="dataEducation.irnituEdu2020"
              :false-value="null"
              label="Выпускник ИРНИТУ 2023 года"
          ></q-checkbox>

          <div v-if="dataEducation.irnituEdu2020" class="text-red-6 q-mx-md">Для выпускников ИРНИТУ этого года можно не
            указывать серию, номер, дату выдачи и скан диплома
          </div>

        </div>

      </div>

      <div class="q-mb-lg">
        <h6 class="q-mb-md q-mt-md">Документы об образовании</h6>

        <q-field
            outlined
            :rules="[
                v => !!$store.getters['edu_order/userOrderDocByRole'].education || 'Не добаввлен документ об образовании'
            ]"
            flat
            reactive-rules
            ref="docs"
        >
          <template v-slot:control>
            <div class="full-width q-my-xs">
              <edu-doc-public-embed
                  :items="storeOrder.docs"
                  :order="storeOrder"
                  doc-role="education"
                  @changed="refetchDocsOverrided"
              />
            </div>
          </template>
        </q-field>
      </div>


      <div class="row q-col-gutter-sm q-mb-lg">
        <div class="col-24">
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
          />
        </div>

      </div>


    </q-form>

  </CWrapper>

</template>

<script>

import Base from './_base'
import CWrapper from './_wrapper'

export default {
  extends: Base,
  components: {
    CWrapper
  },
  data() {
    return {
      canSave: true,
    }
  },
  methods: {
    async refetchDocsOverrided() {
      await this.refetchDocs()
      this.$refs.docs.resetValidation()
    },

    getSaveQuery() {
      return {
        mutation: require('~module/edu-org/modules/order/gql/order/mutation/old/section_update.gql'),
        variables: {
          section: 'education',
          data: {
            prevEduLevel: this.dataEducation.prevEduLevel,
            irnituEdu2020: this.dataEducation.irnituEdu2020,
            level: this.dataEducation.level,
            specialty: this.dataEducation.specialty,
            docCountryType: this.dataEducation.docCountryType,
            docCity: this.dataEducation.docCity,
            languages: this.dataPersonal.languages,
            languageCustom: this.dataPersonal.languageCustom,
          },
        },
      }
    }
  },
  computed: {
    dataEducation() {
      return this.orderData.anket.education
    },
    dataPersonal() {
      return this.orderData.anket.personal
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
