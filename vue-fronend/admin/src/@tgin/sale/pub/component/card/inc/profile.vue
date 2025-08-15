<template>
  <q-item-section>
    <q-item-label class="text-dark">
      {{ title }}
    </q-item-label>
    <q-item-label caption>
      <div>
        {{ caption }}
      </div>
      <div v-if="false" class="q-mt-sm">
        {{ personTypeName }}
      </div>
    </q-item-label>
  </q-item-section>
</template>

<script>
export default {
  props: {
    item: {},
  },
  components: {},
  data() {
    return {}
  },
  computed: {

    caption() {
      return this.fields.map(field => field.NAME + ': ' + field.VALUE).join(', ')
    },

    props() {
      return this.item.PROPS.map((prop) => {
        return {
          ...this.$store.getters['sale/orderPropsById'][prop.ID],
          ...prop,
        }
      })
    },

    fields() {
      return this.props.filter(
        prop =>
          prop.VALUE &&
          !prop.PROFILE_TEASER_HIDE &&
          !prop.IS_UTIL &&
          prop.IS_PROFILE &&
          prop.ROLE !== 'ADDRESS'
      ).map((prop) => {
        return {
          ID: prop.PROP_ID,
          NAME: prop.NAME,
          VALUE: prop.VALUE_VIEW
        }
      })
    },

    propProfileName() {
      return this.props.find((prop) => prop.IS_PROFILE_NAME)
    },

    title() {
      return this.propProfileName ? this.propProfileName.VALUE : this.item.NAME
    },

    personTypeName() {
      const personType = this.$store.getters['sale/personTypesById'][this.item.PERSON_TYPE_ID]
      return personType && personType.NAME
    },

  },
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>


</style>
