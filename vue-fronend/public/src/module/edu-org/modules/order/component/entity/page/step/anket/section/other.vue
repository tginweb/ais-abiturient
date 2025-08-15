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

        <div class="col-24 col-sm-12">

          <q-select
            v-model="compNeedFlat"
            :options="[
              {value: 'false', label: 'нет'},
              {value: 'true', label: 'да'},
            ]"
            emit-value
            label="Нуждаюсь в общежитии"
            map-options
            outlined
          />

        </div>

      </div>

      <div class="row q-col-gutter-sm q-mb-lg">

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
          />

        </div>

        <div v-if="dataPersonal.languages.indexOf(100) > -1" class="col-24 col-sm-12">

          <q-input
            v-model="dataPersonal.languageCustom"
            label="Другой язык"
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
      flat: null
    }
  },
  methods: {

    getSaveQuery() {
      return {
        mutation: require('~module/edu-org/modules/order/gql/order/mutation/old/section_update.gql'),
        variables: {
          section: 'other',
          data: {
            needFlat: this.dataPersonal.needFlat,
            languages: this.dataPersonal.languages,
            languageCustom: this.dataPersonal.languageCustom,
          },
        },
      }
    }
  },
  computed: {
    dataPersonal() {
      return this.orderData.anket.personal
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
