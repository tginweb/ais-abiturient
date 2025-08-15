<template>
  <q-item-section v-if="item">
    <q-item-label class="text-dark">
     {{item.ID}}  {{ item.NAME }}
    </q-item-label>
    <q-item-label caption>
      <div>
        {{ item.CAPTION }}
      </div>
      <div class="q-mt-xs text-weight-bold" v-if="showPersonType || showCompany">
        <template v-if="showPersonType && item.PERSON_TYPE">{{ item.PERSON_TYPE.NAME }}</template>
        <template v-if="showCompany">{{ companyName }}</template>
      </div>
    </q-item-label>
  </q-item-section>
</template>

<script>
export default {
  props: {
    item: {},
    showPersonType: {},
    showCompany: {}
  },
  components: {},
  data() {
    return {}
  },
  computed: {
    companyName() {
      return this.item.COMPANY && this.item.COMPANY.NAME
    },
  },
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>


</style>
