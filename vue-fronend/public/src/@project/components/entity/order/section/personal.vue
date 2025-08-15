<template>


  <div class="com s-info-section">

    <div class="__header">Персональные данные</div>

    <q-list class="__items">
      <q-item class="__item">
        <q-item-section class="__title">ФИО</q-item-section>
        <q-item-section class="__value " side>

          <template v-if="!edit">
            {{ personalData.lastName }} {{ personalData.firstName }} {{ personalData.secondName }}
          </template>

          <div v-else class="row q-col-gutter-md">

            <q-input
                v-model="orderData.anket.personal.lastName"
                class="col-8"
                label="Фамилия"
                outlined
            />

            <q-input
                v-model="orderData.anket.personal.firstName"
                class="col-8"
                label="Имя"
                outlined
            />

            <q-input
                v-model="orderData.anket.personal.secondName"
                class="col-8"
                label="Отчество"
                outlined
            />

          </div>

        </q-item-section>
      </q-item>
      <q-item class="__item">
        <q-item-section class="__title">Гражданство</q-item-section>
        <q-item-section class="__value" side>

          <template v-if="!edit">
            {{
              personalData.citizenship === 'russia' ? 'РФ' : $store.getters['edu_country/byId'][personalData.citizenshipCountry] && $store.getters['edu_country/byId'][personalData.citizenshipCountry].name
            }}
          </template>

          <div v-else class="q-gutter-y-md full-width">


            <q-select
                v-model="orderData.anket.personal.citizenship"
                :options="[
                  {
                    label: 'Житель СНГ',
                    value: 'sng'
                  },
                  {
                    label: 'Иностранец',
                    value: 'other'
                  },
                  {
                    label: 'Россиянин',
                    value: 'russia'
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
                use-input
            />

            <q-select
                v-if="orderData.anket.personal.citizenship==='other'"
                v-model="orderData.anket.personal.citizenshipCountry"
                :options="$store.getters['edu_country/options']"
                :rules="[val => !!val || 'Обязательное поле']"
                emit-value
                label="Страна гражданства"
                map-options
                option-label="name"
                option-value="id"
                outlined
                use-input
            />

          </div>

        </q-item-section>
      </q-item>

      <q-item class="__item">
        <q-item-section class="__title">Дата рождения</q-item-section>
        <q-item-section class="__value" side>

          <template v-if="!edit">
            {{orderData.anket.personal.birthday }}
          </template>
          <div v-else>
            <q-input
                v-model="orderData.anket.personal.birthday"
                class="full-width"
                outlined
            />
          </div>

        </q-item-section>
      </q-item>
      <q-item class="__item">
        <q-item-section class="__title">Место рождения</q-item-section>
        <q-item-section class="__value" side>

          <template v-if="!edit">
            {{orderData.anket.personal.birthplace }}
          </template>
          <template v-else>
            <q-input
                v-model="orderData.anket.personal.birthplace"
                class="full-width"
                outlined
            />
          </template>

        </q-item-section>
      </q-item>

      <q-item class="__item">
        <q-item-section class="__title">Тип документа</q-item-section>
        <q-item-section class="__value" side>

          <template v-if="!edit">
            {{
              $store.getters['edu_personDoctype/byId'][personalData.docType] && $store.getters['edu_personDoctype/byId'][personalData.docType].name || 'Паспорт'
            }}
          </template>
          <template v-else>
            <q-select
                :options="$store.getters['edu_personDoctype/options']"
                :rules="[val => !!val || 'Обязательное поле']"
                emit-value
                map-options
                option-label="name"
                option-value="id"
                outlined
                v-model="personalData.docType"
            />

          </template>


        </q-item-section>
      </q-item>

      <q-item v-if="personalData.doc.number || edit" class="__item">
        <q-item-section class="__title">Документ</q-item-section>
        <q-item-section class="__value" side>

          <div v-if="!edit">
            Серия/Номер: <strong>{{ personalData.doc.serial }} {{ personalData.doc.number }}</strong><br/>
            Дата выдачи: {{ personalData.doc.date }}<br>
            Кем выдан: {{ personalData.doc.organization }}
          </div>

          <div v-else class="row q-col-gutter-md">
            <q-input
                v-model="personalData.doc.serial"
                :rules="[val => !!val || 'Обязательное поле']"
                label="Серия"
                class="col-8"
                outlined
            />
            <q-input
                v-model="personalData.doc.number"
                :rules="[val => !!val || 'Обязательное поле']"
                label="Номер"
                class="col-8"
                outlined
            />
            <q-input
                v-model="personalData.doc.date"
                :rules="[val => !!val || 'Обязательное поле']"
                label="Дата"
                class="col-8"
                outlined
            />
            <q-input
                v-model="personalData.doc.organization"
                :rules="[val => !!val || 'Обязательное поле']"
                label="Организация"
                class="col-24"
                outlined
            />
          </div>

        </q-item-section>
      </q-item>

      <q-item v-if="personalData.docEgeHave" class="__item">
        <q-item-section class="__title">Паспорт ЕГЭ номер и серия</q-item-section>
        <q-item-section class="__value" side>
          {{ personalData.docEge.serial }} {{ personalData.docEge.number }}
        </q-item-section>
      </q-item>

      <q-item v-if="personalData.inn || edit" class="__item">
        <q-item-section class="__title">ИНН</q-item-section>
        <q-item-section class="__value" side>

          <template v-if="!edit">
            {{personalData.inn }}
          </template>
          <div v-else>
            <q-input
                v-model="personalData.inn"
                class="full-width"
                outlined
            />
          </div>

        </q-item-section>
      </q-item>

      <q-item v-if="personalData.snils || edit" class="__item">
        <q-item-section class="__title">СНИЛС</q-item-section>
        <q-item-section class="__value" side>

          <template v-if="!edit">
            {{personalData.snils }}
          </template>
          <div v-else>
            <q-input
                v-model="personalData.snils"
                class="full-width"
                outlined
            />
          </div>

        </q-item-section>
      </q-item>


    </q-list>

  </div>


</template>

<script>

export default {
  components: {},
  props: {
    order: {},
    editable: {},
    edit: {}
  },
  data() {
    return {
      orderData: this.order,
    }
  },
  watch: {
    order(val) {
      this.orderData = val
    }
  },
  computed: {
    personalData() {
      return this.orderData.anket.personal
    }
  }
}
</script>


<style lang="scss" scoped>


</style>
