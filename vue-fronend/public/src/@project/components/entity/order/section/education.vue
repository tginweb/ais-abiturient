<template>


  <div class="com s-info-section">

    <div class="__header">Образование</div>

    <q-list class="__items">
      <q-item
          v-if="(orderData.eduTypeSlug==='asp' || orderData.eduTypeSlug==='mag' || educationData.docType===3) && educationData.level"
          class="__item">
        <q-item-section class="__title">Уровень образования</q-item-section>
        <q-item-section class="__value" side>
          {{
            $store.getters['edu_level/byId'][educationData.level] && $store.getters['edu_level/byId'][educationData.level].name_ak
          }}
        </q-item-section>
      </q-item>
      <q-item v-if="educationData.specialty" class="__item">
        <q-item-section class="__title">Направление (спец-ть)</q-item-section>
        <q-item-section class="__value" side>
          {{ educationData.specialty }}
        </q-item-section>
      </q-item>
      <q-item v-if="educationData.docType" class="__item">
        <q-item-section class="__title">Тип документа</q-item-section>
        <q-item-section class="__value" side>
          {{
            $store.getters['edu_doctype/byId'][educationData.docType] && $store.getters['edu_doctype/byId'][educationData.docType].name
          }}
        </q-item-section>
      </q-item>
      <q-item v-if="educationData.doc.number" class="__item">
        <q-item-section class="__title">Серия / номер документа</q-item-section>
        <q-item-section class="__value" side>
          {{ [educationData.doc.serial, educationData.doc.number].filter(item => !!item && item!=='-').join(' / ') }}
        </q-item-section>
      </q-item>
      <q-item v-if="educationData.doc.date" class="__item">
        <q-item-section class="__title">Дата выдачи</q-item-section>
        <q-item-section class="__value" side>
          {{ educationData.doc.date }}
        </q-item-section>
      </q-item>
      <q-item class="__item">
        <q-item-section class="__title">Образовательная организация</q-item-section>
        <q-item-section class="__value" side>
          {{ educationData.doc.organization }}
        </q-item-section>
      </q-item>
      <q-item v-if="educationData.docCity && educationData.docCity.name" class="__item">
        <q-item-section class="__title">Регион получения</q-item-section>
        <q-item-section class="__value" side>
          {{ educationData.docCity.name }}
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
    educationData() {
      return this.orderData.anket.education
    }
  }
}
</script>


<style lang="scss" scoped>


</style>
