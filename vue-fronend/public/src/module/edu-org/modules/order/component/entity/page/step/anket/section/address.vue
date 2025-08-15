<template>

  <CWrapper
    :can-save="true"
    @next="onNext"
    @save="onSave"
  >


    <q-form
      @submit="onSave"
      ref="form"
    >

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

            <q-checkbox label="Указать вручную" v-model="dataPersonal.addressReg.custom"  :false-value="null"></q-checkbox>

          </div>

        </div>

        <div class="col-24">
          <q-checkbox
            label="Адрес проживания совпадает с адресом регистрации"
            v-model="dataPersonal.addressEqual"
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
                v-model="dataPersonal.addressLive"
                v-show="!dataPersonal.addressLive.custom"
              />

              <q-input
                label="Адрес проживания"
                outlined
                v-model="dataPersonal.addressLive.name"
                v-if="dataPersonal.addressLive.custom"
              ></q-input>
            </div>

            <q-checkbox label="Указать вручную" v-model="dataPersonal.addressLive.custom" :false-value="null"></q-checkbox>

          </div>

        </div>

      </div>

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
          />

        </div>

      </div>

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
            section: 'address',
            data: {
              addressEqual: this.dataPersonal.addressEqual,
              addressLive: this.dataPersonal.addressLive,
              addressReg: this.dataPersonal.addressReg,

              email: this.dataPersonal.email,
              phone: this.dataPersonal.phone,
              phone2: this.dataPersonal.phone2,
            },
          },
        }
      }
    },
    computed: {
      dataPersonal() {
        return this.orderData.anket.personal
      }
    }
  }
</script>


<style lang="sass" scoped>


</style>
