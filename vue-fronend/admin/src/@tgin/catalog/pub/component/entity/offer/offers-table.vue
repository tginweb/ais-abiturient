<template>
  <div>


    <q-markup-table
        class="s-table-data"
    >
      <thead>
      <tr>
        <td>Имя</td>
        <template
            v-for="prop of skuProps"
        >
          <td :key="prop.ID">{{ prop.NAME }}</td>
        </template>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="offer of offers"
          :key="offer.ID"
      >
        <td>{{ offer.ID }} : {{ offer.NAME }}</td>

        <template
            v-for="prop of skuProps"
        >
          <td :key="prop.ID">{{ skuProps[prop.ID].OPTIONS[offersSkuPropsValues[offer.ID][prop.ID]].NAME }}</td>
        </template>

      </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    entity: {}
  },
  data() {
    return {

      selectedOfferId: this.entity.OFFERS[0].ID
    }
  },
  methods: {
    setCurrentById(offerId) {
      this.selectedOfferId = offerId
    },

    setCurrentByValue(propId, value) {

      let offer = this.selectedOffer
      let result = null;
      let values

      if (offer === null)
        return result

      const selectedOfferValues = this.offersSkuPropsValues[offer.ID]

      values = {...selectedOfferValues}
      values[propId] = value;


      result = this.getOfferByValues(values);

      console.log(result)

      if (result !== null)
        return this.setCurrentById(result.ID);

      values = {};

      for (const [offerPropId, offerPropVal] of Object.entries(selectedOfferValues)) {
        values[offerPropId] = offerPropVal

        if (offerPropId === propId) {
          values[offerPropId] = value;
          return false;
        }
      }

      result = this.getOfferByValues(values);

      if (result !== null)
        return this.setCurrentById(result.ID);

      return result;
    },

    getOfferByValues(values) {

      var result = null;

      this.offers.forEach((offer) => {

        var equal = true;

        const offerValues = this.offersSkuPropsValues[offer.ID]

        Object.values(this.skuProps).forEach((property) => {

          const value = offerValues[property.ID]

          if (value && values[property.ID]) {
            if (value != values[property.ID])
              equal = false;
          }
        })

        if (equal) {
          result = offer;
          return false;
        }
      })

      return result;
    }
  },
  computed: {
    offers() {
      return this.entity.OFFERS
    },
    offersById() {
      return this.offers.reduce((map, obj) => (map[obj.ID] = obj, map), {})
    },
    selectedOffer() {
      return this.offersById[this.selectedOfferId]
    },
    selectedOfferScuPropsValues() {
      return this.offersSkuPropsValues[this.selectedOfferId]
    },

    offersSkuPropsValues() {
      return this.offers.reduce((map, offer) => {

        if (!map[offer.ID])
          map[offer.ID] = {}
        map[offer.ID] = offer.PROPS.filter(prop => !!prop.VAL_ENUM_ID).reduce((map, obj) => (map[obj.ID] = obj.VAL_ENUM_ID, map), {})

        return map
      }, {})
    },

    skuPropsValues() {
      const map = {}
      const selectedOffer = this.selectedOffer
      for (const [propId, prop] of Object.entries(this.skuProps)) {
        if (this.offersSkuPropsValues[selectedOffer.ID][propId]) {
          map[propId] = this.offersSkuPropsValues[selectedOffer.ID][propId]
        }
      }
      return map
    },

    skuProps() {
      const map = {}

      this.offers.forEach((offer) => {

        offer.PROPS.forEach((prop) => {

          if (!prop.VAL_ENUM_ID)
            return;

          if (!map[prop.ID]) {
            map[prop.ID] = {
              ...prop,
              OPTIONS: {}
            }
          }

          if (!map[prop.ID].OPTIONS[prop.VAL_ENUM_ID]) {
            map[prop.ID].OPTIONS[prop.VAL_ENUM_ID] = {
              ID: prop.VAL_ENUM_ID,
              NAME: prop.VAL,
              OFFERS: []
            }
          }

          map[prop.ID].OPTIONS[prop.VAL_ENUM_ID].OFFERS.push(offer.ID)
        })
      })

      return map
    },

    optionsSelected() {

    },

    optionsEnabled() {

      const properties = []

      const currentValues = this.skuPropsValues

      const result = {}

      Object.values(this.skuProps).forEach((property) => {

        const propId = property.ID

        this.offers.forEach((offer) => {

          let compared = true;

          const offerValue = this.offersSkuPropsValues[offer.ID][property.ID]
          const offerValues = this.offersSkuPropsValues[offer.ID]

          if (true) {

            properties.forEach((property) => {
              if (offerValues[property.ID] != currentValues[property.ID]) {
                compared = false;
                return false;
              }
            })

          } else if (properties.length > 0) {
            compared = false;
          }

          if (compared) {

            if (!result[propId])
              result[propId] = {};

            result[propId][offerValue] = offerValue
          }
        })

        properties.push(property);
      });

      return result
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
