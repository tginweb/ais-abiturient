<template>

  <div class="com s-info-section">

    <div class="__header">Другие данные</div>


    <q-list class="__items">
      <q-item class="__item">
        <q-item-section class="__title">Знание языков</q-item-section>
        <q-item-section class="__value" side>
          {{ compLanguages.join(', ') }}
        </q-item-section>
      </q-item>
      <q-item class="__item">
        <q-item-section class="__title">Нуждаюсь в общежитии</q-item-section>
        <q-item-section class="__value" side>
          {{ personalData.needFlat ? 'да' : 'нет' }}
        </q-item-section>
      </q-item>
      <q-item v-if="personalData.family.length>0" class="__item">
        <q-item-section class="__title">Семья</q-item-section>
        <q-item-section class="__value" side>

          <div v-if="personalData.family.length>0" class="q-gutter-sm">
            <div
                v-for="item in personalData.family"
                class="text-left"
            >

              {{
                $store.getters['edu_familyType/byId'][item.familyType] && $store.getters['edu_familyType/byId'][item.familyType].name
              }}:
              {{ item.fio }}<br>
              {{ item.phone }}

            </div>
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
    order: {}
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
    },

    compLanguages() {
      return this.personalData.languages.map((nid) => this.$store.getters['edu_language/byId'][nid] && this.$store.getters['edu_language/byId'][nid].name)
    }
  }
}
</script>


<style lang="scss" scoped>


</style>
